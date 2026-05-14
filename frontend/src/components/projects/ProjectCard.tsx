import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Users, Calendar } from 'lucide-react'
import type { Project } from '../../types/project.types'
import { useAuth } from '../../context/AuthContext'
import './ProjectCard.css'

interface Props {
  project:  Project
  onEdit:   (project: Project) => void
  onDelete: (project: Project) => void
}

const ProjectCard = ({ project, onEdit, onDelete }: Props) => {
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const isAdmin      = user?.role === 'admin'

  const formattedDate = new Date(project.created_at).toLocaleDateString(
    'en-US', { year: 'numeric', month: 'short', day: 'numeric' }
  )

  return (
    <div
      className='project-card'
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Card Header */}
      <div className='project-card__header'>
        <div className='project-card__icon'>
          {project.name.charAt(0).toUpperCase()}
        </div>
        {isAdmin && (
          <div
            className='project-card__actions'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='project-card__action-btn'
              onClick={() => onEdit(project)}
              title='Edit project'
            >
              <Pencil size={14} />
            </button>
            <button
              className='project-card__action-btn project-card__action-btn--danger'
              onClick={() => onDelete(project)}
              title='Delete project'
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className='project-card__body'>
        <h3 className='project-card__name'>{project.name}</h3>
        <p className='project-card__desc'>
          {project.description || 'No description provided'}
        </p>
      </div>

      {/* Card Footer */}
      <div className='project-card__footer'>
        <span className='project-card__meta'>
          <Users size={13} />
          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
        </span>
        <span className='project-card__meta'>
          <Calendar size={13} />
          {formattedDate}
        </span>
      </div>
    </div>
  )
}

export default ProjectCard