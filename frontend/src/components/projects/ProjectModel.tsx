import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { Project } from '../../types/project.types'
import './ProjectModel.css'

const schema = z.object({
  name:        z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  isOpen:     boolean
  onClose:    () => void
  onSubmit:   (data: FormData) => void
  isLoading:  boolean
  editData?:  Project | null
}

const ProjectModal = ({
  isOpen, onClose, onSubmit, isLoading, editData
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name, description: editData.description || '' })
    } else {
      reset({ name: '', description: '' })
    }
  }, [editData, isOpen])

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal__header'>
          <h2 className='modal__title'>
            {editData ? 'Edit Project' : 'Create Project'}
          </h2>
          <button className='modal__close' onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='modal__form'>
          <div className='form-group'>
            <label className='form-label'>Project Name *</label>
            <input
              type='text'
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder='e.g. Website Redesign'
              {...register('name')}
            />
            {errors.name && (
              <span className='form-error'>{errors.name.message}</span>
            )}
          </div>

          <div className='form-group'>
            <label className='form-label'>Description</label>
            <textarea
              className='form-input modal__textarea'
              placeholder='Describe the project...'
              {...register('description')}
            />
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
                : editData ? 'Save Changes' : 'Create Project'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal