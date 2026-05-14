import { useState } from 'react'
import { CheckSquare } from 'lucide-react'
import {
  useMyTasks,
  useUpdateTaskStatus,
  useDeleteTask,
} from '../../hooks/useTasks'
import { useToast }      from '../../hooks/useToast'
import TaskRow           from '../../components/tasks/TaskRow'
import TaskFilters       from '../../components/tasks/TaskFilters'
import ConfirmDialog     from '../../components/common/ConfirmDialog'
import LoadingSpinner    from '../../components/common/LoadingSpinner'
import ErrorMessage      from '../../components/common/ErrorMessage'
import Toast             from '../../components/common/Toast'
import type { Task, TaskStatus } from '../../types/task.types'
import './TasksPage.css'

const TasksPage = () => {
  const toast = useToast()

  const { data: tasks, isLoading, isError } = useMyTasks()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask   = useDeleteTask()

  const [deleteTarget,    setDeleteTarget]    = useState<Task | null>(null)
  const [statusFilter,    setStatusFilter]    = useState('')
  const [priorityFilter,  setPriorityFilter]  = useState('')
  const [searchQuery,     setSearchQuery]     = useState('')

  const filtered = (tasks as Task[] || [])?.filter((task: Task) => {
    const matchSearch   = task.title.toLowerCase().includes(
                            searchQuery.toLowerCase()
                          )
    const matchStatus   = statusFilter === 'overdue'
                            ? task.is_overdue
                            : statusFilter
                              ? task.status === statusFilter
                              : true
    const matchPriority = priorityFilter ? task.priority === priorityFilter : true
    return matchSearch && matchStatus && matchPriority
  })

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      await updateStatus.mutateAsync({ id: task.id, data: { status } })
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTask.mutateAsync(deleteTarget.id)
      toast.success('Task deleted!')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete task')
    }
  }

  if (isLoading) {
    return (
      <div className='flex-center' style={{ height: '60vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  if (isError) return <ErrorMessage message='Failed to load tasks' />

  return (
    <div className='tasks-page'>
      {/* Header */}
      <div className='page-header'>
        <div>
          <h1 className='page-title'>My Tasks</h1>
          <p className='page-subtitle'>
            {filtered?.length || 0} task{filtered?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Task List */}
      {filtered?.length === 0 ? (
        <div className='tasks-page__empty'>
          <CheckSquare size={48} color='var(--gray-300)' />
          <h3>No tasks found</h3>
          <p>
            {(tasks as Task[] || [])?.length === 0
              ? 'No tasks have been assigned to you yet'
              : 'No tasks match your current filters'
            }
          </p>
        </div>
      ) : (
        <div className='tasks-page__list'>
          {filtered?.map((task: Task) => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={() => {}}
              onDelete={setDeleteTarget}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title='Delete Task'
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteTask.isPending}
      />

      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default TasksPage