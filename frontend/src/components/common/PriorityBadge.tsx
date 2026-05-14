// src/components/common/PriorityBadge.tsx
import type { TaskPriority } from '../../types/task.types'
import './PriorityBadge.css'

interface Props {
  priority: TaskPriority
}

const PriorityBadge = ({ priority }: Props) => {
  return (
    <span className={`priority-badge priority-badge--${priority}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

export default PriorityBadge