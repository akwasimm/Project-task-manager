import { useState } from 'react'
import { CheckSquare } from 'lucide-react'
import {
  useMyTasks,
  useUpdateTask,
  useUpdateTaskStatus,
  useDeleteTask,
} from '../../hooks/useTasks'
import { useUsers }     from '../../hooks/useUsers'
import { useToast }      from '../../hooks/useToast'
import TaskRow           from '../../components/tasks/TaskRow'
import TaskFilters       from '../../components/tasks/TaskFilters'
import TaskModal         from '../../components/tasks/TaskModel'
import ConfirmDialog     from '../../components/common/ConfirmDialog'
import LoadingSpinner    from '../../components/common/LoadingSpinner'
import ErrorMessage      from '../../components/common/ErrorMessage'
import Toast             from '../../components/common/Toast'
import type { Task, TaskStatus } from '../../types/task.types'
import './TasksPage.css'

const TasksPage = () => {
  const toast = useToast()

  const { data: tasks, isLoading, isError } = useMyTasks()
  const { data: allUsers } = useUsers()
  const updateTask   = useUpdateTask()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask   = useDeleteTask()

  const [deleteTarget,    setDeleteTarget]    = useState<Task | null>(null)
  const [editTask,        setEditTask]        = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
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

  const handleUpdateTask = async (data: any) => {
    if (!editTask) return
    try {
      await updateTask.mutateAsync({
        id: editTask.id,
        data: {
          ...data,
          due_date: data.due_date || undefined,
          assigned_to: data.assigned_to || undefined,
        },
      })
      toast.success('Task updated!')
      setEditTask(null)
      setIsTaskModalOpen(false)
    } catch {
      toast.error('Failed to update task')
    }
  }

  const openEditTask = (task: Task) => {
    setEditTask(task)
    setIsTaskModalOpen(true)
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
              onEdit={openEditTask}
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditTask(null) }}
        onSubmit={handleUpdateTask}
        isLoading={updateTask.isPending}
        members={allUsers || []}
        editData={editTask}
      />

      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default TasksPage