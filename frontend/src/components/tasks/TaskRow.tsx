import { Pencil, Trash2, Calendar, User } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task.types'
import { useAuth } from '../../context/AuthContext'
import StatusBadge   from '../common/StatusBadge'
import PriorityBadge from '../common/PriorityBadge'
import './TaskRow.css'

interface Props {
  task:           Task
  onEdit:         (task: Task) => void
  onDelete:       (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

const TaskRow = ({ task, onEdit, onDelete, onStatusChange }: Props) => {
  const { user } = useAuth()
  const isAdmin  = user?.role === 'admin'
  const isOwner  = task.assignee?.id === user?.id

  const formattedDue = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : null

  return (
    <div className={`task-row ${task.is_overdue ? 'task-row--overdue' : ''}`}>
      {/* Left info */}
      <div className='task-row__info'>
        <span className='task-row__title'>{task.title}</span>
        {task.description && (
          <span className='task-row__desc'>{task.description}</span>
        )}
        <div className='task-row__meta'>
          {task.assignee && (
            <span className='task-row__assignee'>
              <User size={12} />
              {task.assignee.name}
            </span>
          )}
          {formattedDue && (
            <span
              className={`task-row__due ${task.is_overdue ? 'task-row__due--overdue' : ''}`}
            >
              <Calendar size={12} />
              {formattedDue}
            </span>
          )}
        </div>
      </div>

      {/* Right badges + actions */}
      <div className='task-row__right'>
        <PriorityBadge priority={task.priority} />

        {/* Status selector */}
        {(isAdmin || isOwner) ? (
          <select
            className='task-row__status-select'
            value={task.status}
            onChange={(e) =>
              onStatusChange(task, e.target.value as TaskStatus)
            }
          >
            <option value='todo'>To Do</option>
            <option value='in_progress'>In Progress</option>
            <option value='done'>Done</option>
          </select>
        ) : (
          <StatusBadge status={task.is_overdue ? 'overdue' : task.status} />
        )}

        {/* Admin actions */}
        {isAdmin && (
          <div className='task-row__actions'>
            <button
              className='project-card__action-btn'
              onClick={() => onEdit(task)}
              title='Edit task'
            >
              <Pencil size={13} />
            </button>
            <button
              className='project-card__action-btn project-card__action-btn--danger'
              onClick={() => onDelete(task)}
              title='Delete task'
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskRow