import { Trash2 } from 'lucide-react'
import type { User } from '../../types/auth.types'
import { useAuth } from '../../context/AuthContext'
import './UserRow.css'

interface Props {
  user:     User
  onDelete: (user: User) => void
}

const UserRow = ({ user, onDelete }: Props) => {
  const { user: currentUser } = useAuth()
  const isSelf = user.id === currentUser?.id

  return (
    <div className='user-row'>
      <div className='user-row__avatar'>
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className='user-row__info'>
        <span className='user-row__name'>
          {user.name}
          {isSelf && <span className='user-row__you'>You</span>}
        </span>
        <span className='user-row__email'>{user.email}</span>
      </div>

      <span className={`user-row__role user-row__role--${user.role}`}>
        {user.role}
      </span>

      <span className='user-row__date'>
        {new Date(user.created_at).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        })}
      </span>

      {!isSelf && (
        <button
          className='project-card__action-btn project-card__action-btn--danger'
          onClick={() => onDelete(user)}
          title='Delete user'
        >
          <Trash2 size={14} />
        </button>
      )}
      {isSelf && <div style={{ width: 28 }} />}
    </div>
  )
}

export default UserRow