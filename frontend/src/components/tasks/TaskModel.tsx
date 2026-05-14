import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { Task } from '../../types/task.types'
import type { User } from '../../types/auth.types'
import './TaskModel.css'

const schema = z.object({
  title:       z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status:      z.enum(['todo', 'in_progress', 'done']),
  priority:    z.enum(['low', 'medium', 'high']),
  due_date:    z.string().optional(),
  assigned_to: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  isOpen:     boolean
  onClose:    () => void
  onSubmit:   (data: FormData) => void
  isLoading:  boolean
  members:    User[]
  editData?:  Task | null
}

const TaskModal = ({
  isOpen, onClose, onSubmit, isLoading, members, editData
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'todo', priority: 'medium' },
  })

  useEffect(() => {
    if (editData) {
      reset({
        title:       editData.title,
        description: editData.description || '',
        status:      editData.status,
        priority:    editData.priority,
        due_date:    editData.due_date
          ? new Date(editData.due_date).toISOString().split('T')[0]
          : '',
        assigned_to: editData.assignee?.id || '',
      })
    } else {
      reset({
        title: '', description: '',
        status: 'todo', priority: 'medium',
        due_date: '', assigned_to: '',
      })
    }
  }, [editData, isOpen])

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal modal--wide' onClick={(e) => e.stopPropagation()}>
        <div className='modal__header'>
          <h2 className='modal__title'>
            {editData ? 'Edit Task' : 'Create Task'}
          </h2>
          <button className='modal__close' onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='modal__form'>
          {/* Title */}
          <div className='form-group'>
            <label className='form-label'>Task Title *</label>
            <input
              type='text'
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder='e.g. Design homepage wireframes'
              {...register('title')}
            />
            {errors.title && (
              <span className='form-error'>{errors.title.message}</span>
            )}
          </div>

          {/* Description */}
          <div className='form-group'>
            <label className='form-label'>Description</label>
            <textarea
              className='form-input modal__textarea'
              placeholder='Task details...'
              {...register('description')}
            />
          </div>

          {/* Row: Status + Priority */}
          <div className='task-modal__row'>
            <div className='form-group'>
              <label className='form-label'>Status</label>
              <select className='form-select' {...register('status')}>
                <option value='todo'>To Do</option>
                <option value='in_progress'>In Progress</option>
                <option value='done'>Done</option>
              </select>
            </div>
            <div className='form-group'>
              <label className='form-label'>Priority</label>
              <select className='form-select' {...register('priority')}>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>

          {/* Row: Due Date + Assignee */}
          <div className='task-modal__row'>
            <div className='form-group'>
              <label className='form-label'>Due Date</label>
              <input
                type='date'
                className='form-input'
                {...register('due_date')}
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Assign To</label>
              <select className='form-select' {...register('assigned_to')}>
                <option value=''>-- Unassigned --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='modal__actions'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={isLoading}
            >
              {isLoading
                ? editData ? 'Saving...' : 'Creating...'
                : editData ? 'Save Changes' : 'Create Task'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal