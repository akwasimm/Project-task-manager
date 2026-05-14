import { useState } from 'react'
import { Users } from 'lucide-react'
import { useUsers, useDeleteUser } from '../../hooks/useUsers'
import { useToast }    from '../../hooks/useToast'
import UserRow         from '../../components/users/UserRow'
import ConfirmDialog   from '../../components/common/ConfirmDialog'
import LoadingSpinner  from '../../components/common/LoadingSpinner'
import ErrorMessage    from '../../components/common/ErrorMessage'
import Toast           from '../../components/common/Toast'
import type { User }        from '../../types/auth.types'
import './UsersPage.css'

const UsersPage = () => {
  const toast = useToast()

  const { data: users, isLoading, isError } = useUsers()
  const deleteUser = useDeleteUser()

  const [deleteTarget,  setDeleteTarget]  = useState<User | null>(null)
  const [searchQuery,   setSearchQuery]   = useState('')

  const filtered = (users as User[] || [])?.filter(
    (u: User) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteUser.mutateAsync(deleteTarget.id)
      toast.success('User deleted!')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete user')
    }
  }

  if (isLoading) {
    return (
      <div className='flex-center' style={{ height: '60vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  if (isError) return <ErrorMessage message='Failed to load users' />

  return (
    <div className='users-page'>
      {/* Header */}
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Users</h1>
          <p className='page-subtitle'>
            {(users as User[] || [])?.length || 0} total user{(users as User[] || [])?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className='users-page__search'>
        <input
          type='text'
          className='form-input'
          placeholder='Search by name or email...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Header */}
      <div className='users-page__table-header'>
        <span>User</span>
        <span>Role</span>
        <span>Joined</span>
        <span></span>
      </div>

      {/* Users List */}
      {filtered?.length === 0 ? (
        <div className='users-page__empty'>
          <Users size={48} color='var(--gray-300)' />
          <h3>No users found</h3>
        </div>
      ) : (
        <div className='users-page__list'>
          {filtered?.map((user: User) => (
            <UserRow
              key={user.id}
              user={user}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title='Delete User'
        message={`Delete "${deleteTarget?.name}"? This will remove them from all projects.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteUser.isPending}
      />

      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default UsersPage