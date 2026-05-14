// src/components/common/StatusBadge.tsx
import type { TaskStatus } from '../../types/task.types'
import './StatusBadge.css'

interface Props {
  status: TaskStatus | 'overdue'
}

const labels: Record<string, string> = {
  todo:        'To Do',
  in_progress: 'In Progress',
  done:        'Done',
  overdue:     'Overdue',
}

const StatusBadge = ({ status }: Props) => {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {labels[status]}
    </span>
  )
}

export default StatusBadge