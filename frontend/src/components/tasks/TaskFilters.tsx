import './TaskFiters.css'

interface Props {
  statusFilter:   string
  priorityFilter: string
  searchQuery:    string
  onStatusChange:   (v: string) => void
  onPriorityChange: (v: string) => void
  onSearchChange:   (v: string) => void
}

const TaskFilters = ({
  statusFilter, priorityFilter, searchQuery,
  onStatusChange, onPriorityChange, onSearchChange,
}: Props) => {
  return (
    <div className='task-filters'>
      <input
        type='text'
        className='form-input task-filters__search'
        placeholder='Search tasks...'
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className='form-select task-filters__select'
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value=''>All Status</option>
        <option value='todo'>To Do</option>
        <option value='in_progress'>In Progress</option>
        <option value='done'>Done</option>
        <option value='overdue'>Overdue</option>
      </select>

      <select
        className='form-select task-filters__select'
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value=''>All Priority</option>
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
      </select>
    </div>
  )
}

export default TaskFilters