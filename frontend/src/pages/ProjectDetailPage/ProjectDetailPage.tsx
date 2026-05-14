import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, UserPlus, UserMinus,
  ArrowLeft, Users
} from 'lucide-react'
import { useProject }      from '../../hooks/useProject'
import { useProjectTasks, useCreateTask,
         useUpdateTaskStatus, useDeleteTask } from '../../hooks/useTasks'
import { useUsers }        from '../../hooks/useUsers'
import { useAddMember, useRemoveMember } from '../../hooks/useProject'
import { useAuth }         from '../../context/AuthContext'
import { useToast }        from '../../hooks/useToast'
import TaskRow             from '../../components/tasks/TaskRow'
import TaskModal           from '../../components/tasks/TaskModel'
import ConfirmDialog       from '../../components/common/ConfirmDialog'
import LoadingSpinner      from '../../components/common/LoadingSpinner'
import ErrorMessage        from '../../components/common/ErrorMessage'
import Toast               from '../../components/common/Toast'
import type { Task, TaskStatus } from '../../types/task.types'
import type { User }             from '../../types/auth.types'
import './ProjectDetailPage.css'

const ProjectDetailPage = () => {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const toast      = useToast()
  const isAdmin    = user?.role === 'admin'

  const { data: project,  isLoading: projectLoading  } = useProject(id!)
  const { data: tasks,    isLoading: tasksLoading    } = useProjectTasks(id!)
  const { data: allUsers                              } = useUsers()

  const createTask      = useCreateTask()
  const updateStatus    = useUpdateTaskStatus()
  const deleteTask      = useDeleteTask()
  const addMember       = useAddMember()
  const removeMember    = useRemoveMember()

  const [isTaskModalOpen,  setIsTaskModalOpen]  = useState(false)
  const [editTask,         setEditTask]         = useState<Task | null>(null)
  const [deleteTarget,     setDeleteTarget]     = useState<Task | null>(null)
  const [selectedUserId,   setSelectedUserId]   = useState('')
  const [removeMemberTarget, setRemoveMemberTarget] = useState<User | null>(null)

  if (projectLoading || tasksLoading) {
    return (
      <div className='flex-center' style={{ height: '60vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  if (!project) return <ErrorMessage message='Project not found' />

  // Users NOT already in project
  const nonMembers = (allUsers as User[] || [])?.filter((u: User) =>
    !project.members.find((m: User) => m.id === u.id)
  ) || []

  const handleCreateTask = async (data: any) => {
    try {
      await createTask.mutateAsync({
        projectId: id!,
        data: {
          ...data,
          due_date:    data.due_date    || undefined,
          assigned_to: data.assigned_to || undefined,
        },
      })
      toast.success('Task created!')
      setIsTaskModalOpen(false)
    } catch {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async () => {
    if (!editTask) return
    try {
      await updateStatus.mutateAsync({
        id: editTask.id,
        data: { status: editTask.status },
      })
      toast.success('Task updated!')
      setEditTask(null)
      setIsTaskModalOpen(false)
    } catch {
      toast.error('Failed to update task')
    }
  }

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      await updateStatus.mutateAsync({ id: task.id, data: { status } })
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDeleteTask = async () => {
    if (!deleteTarget) return
    try {
      await deleteTask.mutateAsync(deleteTarget.id)
      toast.success('Task deleted!')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const handleAddMember = async () => {
    if (!selectedUserId) return
    try {
      await addMember.mutateAsync({
        projectId: id!,
        data: { user_id: selectedUserId },
      })
      toast.success('Member added!')
      setSelectedUserId('')
    } catch {
      toast.error('Failed to add member')
    }
  }

  const handleRemoveMember = async () => {
    if (!removeMemberTarget) return
    try {
      await removeMember.mutateAsync({
        projectId: id!,
        userId: removeMemberTarget.id,
      })
      toast.success('Member removed!')
      setRemoveMemberTarget(null)
    } catch {
      toast.error('Failed to remove member')
    }
  }

  const openEditTask = (task: Task) => {
    setEditTask(task)
    setIsTaskModalOpen(true)
  }

  return (
    <div className='project-detail'>

      {/* Back Button */}
      <button
        className='project-detail__back'
        onClick={() => navigate('/projects')}
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Header */}
      <div className='project-detail__header card'>
        <div className='project-detail__header-left'>
          <div className='project-detail__icon'>
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className='project-detail__name'>{project.name}</h1>
            <p className='project-detail__desc'>
              {project.description || 'No description'}
            </p>
            <p className='text-xs text-muted'>
              Created by {project.owner?.name} ·{' '}
              {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className='project-detail__stats'>
          <div className='project-detail__stat'>
            <span className='project-detail__stat-value'>
              {tasks?.length || 0}
            </span>
            <span className='project-detail__stat-label'>Tasks</span>
          </div>
          <div className='project-detail__stat'>
            <span className='project-detail__stat-value'>
              {project.members.length}
            </span>
            <span className='project-detail__stat-label'>Members</span>
          </div>
          <div className='project-detail__stat'>
            <span
              className='project-detail__stat-value'
              style={{ color: 'var(--success)' }}
            >
              {tasks?.filter((t: Task) => t.status === 'done').length || 0}
            </span>
            <span className='project-detail__stat-label'>Done</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className='project-detail__grid'>

        {/* Tasks Section */}
        <div className='project-detail__tasks'>
          <div className='project-detail__section-header'>
            <h2 className='project-detail__section-title'>
              Tasks ({tasks?.length || 0})
            </h2>
            {isAdmin && (
              <button
                className='btn btn-primary btn-sm'
                onClick={() => setIsTaskModalOpen(true)}
              >
                <Plus size={14} />
                Add Task
              </button>
            )}
          </div>

          {tasks?.length === 0 ? (
            <div className='project-detail__empty'>
              <p>No tasks yet</p>
              {isAdmin && (
                <p className='text-sm text-muted'>
                  Click "Add Task" to create the first task
                </p>
              )}
            </div>
          ) : (
            <div className='project-detail__task-list'>
              {tasks?.map((task: Task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={openEditTask}
                  onDelete={setDeleteTarget}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Members Section */}
        <div className='project-detail__members card'>
          <div className='project-detail__section-header'>
            <h2 className='project-detail__section-title'>
              <Users size={16} />
              Members
            </h2>
          </div>

          {/* Add Member (Admin) */}
          {isAdmin && nonMembers.length > 0 && (
            <div className='project-detail__add-member'>
              <select
                className='form-select'
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value=''>Select a user...</option>
                {nonMembers.map((u: User) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <button
                className='btn btn-primary btn-sm'
                onClick={handleAddMember}
                disabled={!selectedUserId || addMember.isPending}
              >
                <UserPlus size={14} />
                Add
              </button>
            </div>
          )}

          {/* Member List */}
          <div className='project-detail__member-list'>
            {project.members.length === 0 ? (
              <p className='text-sm text-muted'>No members yet</p>
            ) : (
              project.members.map((member: User) => (
                <div key={member.id} className='project-detail__member'>
                  <div className='project-detail__member-avatar'>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='project-detail__member-info'>
                    <span className='project-detail__member-name'>
                      {member.name}
                    </span>
                    <span className='project-detail__member-role'>
                      {member.role}
                    </span>
                  </div>
                  {isAdmin && member.id !== user?.id && (
                    <button
                      className='project-detail__remove-btn'
                      onClick={() => setRemoveMemberTarget(member)}
                      title='Remove member'
                    >
                      <UserMinus size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditTask(null) }}
        onSubmit={editTask ? handleUpdateTask : handleCreateTask}
        isLoading={createTask.isPending || updateStatus.isPending}
        members={project.members}
        editData={editTask}
      />

      {/* Delete Task Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title='Delete Task'
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteTask.isPending}
      />

      {/* Remove Member Confirm */}
      <ConfirmDialog
        isOpen={!!removeMemberTarget}
        title='Remove Member'
        message={`Remove "${removeMemberTarget?.name}" from this project?`}
        onConfirm={handleRemoveMember}
        onCancel={() => setRemoveMemberTarget(null)}
        isLoading={removeMember.isPending}
      />

      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default ProjectDetailPage