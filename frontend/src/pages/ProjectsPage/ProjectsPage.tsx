import { useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '../../hooks/useProject'
import { useAuth }       from '../../context/AuthContext'
import { useToast }      from '../../hooks/useToast'
import ProjectCard       from '../../components/projects/ProjectCard'
import ProjectModal      from '../../components/projects/ProjectModel'
import ConfirmDialog     from '../../components/common/ConfirmDialog'
import LoadingSpinner    from '../../components/common/LoadingSpinner'
import ErrorMessage      from '../../components/common/ErrorMessage'
import Toast             from '../../components/common/Toast'
import type { Project }       from '../../types/project.types'
import './ProjectsPage.css'

const ProjectsPage = () => {
  const { user }   = useAuth()
  const isAdmin    = user?.role === 'admin'
  const toast      = useToast()

  const { data: projects, isLoading, isError } = useProjects()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const deleteProject = useDeleteProject()

  const [isModalOpen,   setIsModalOpen]   = useState(false)
  const [editProject,   setEditProject]   = useState<Project | null>(null)
  const [deleteTarget,  setDeleteTarget]  = useState<Project | null>(null)
  const [searchQuery,   setSearchQuery]   = useState('')

  const filteredProjects = (projects as Project[] || [])?.filter((p: Project) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async (data: { name: string; description?: string }) => {
    try {
      await createProject.mutateAsync(data)
      toast.success('Project created successfully!')
      setIsModalOpen(false)
    } catch {
      toast.error('Failed to create project')
    }
  }

  const handleUpdate = async (data: { name: string; description?: string }) => {
    if (!editProject) return
    try {
      await updateProject.mutateAsync({ id: editProject.id, data })
      toast.success('Project updated successfully!')
      setEditProject(null)
      setIsModalOpen(false)
    } catch {
      toast.error('Failed to update project')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProject.mutateAsync(deleteTarget.id)
      toast.success('Project deleted successfully!')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const openEdit = (project: Project) => {
    setEditProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditProject(null)
  }

  if (isLoading) {
    return (
      <div className='flex-center' style={{ height: '60vh' }}>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage message='Failed to load projects' />
  }

  return (
    <div className='projects-page'>
      {/* Header */}
      <div className='page-header'>
        <div>
          <h1 className='page-title'>Projects</h1>
          <p className='page-subtitle'>
            {(projects as Project[] || [])?.length || 0} project{(projects as Project[] || [])?.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            className='btn btn-primary'
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            New Project
          </button>
        )}
      </div>

      {/* Search */}
      <div className='projects-page__search'>
        <input
          type='text'
          className='form-input'
          placeholder='Search projects...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filteredProjects?.length === 0 ? (
        <div className='projects-page__empty'>
          <FolderOpen size={48} color='var(--gray-300)' />
          <h3>No projects found</h3>
          <p>
            {isAdmin
              ? 'Create your first project to get started'
              : 'You have not been added to any projects yet'
            }
          </p>
        </div>
      ) : (
        <div className='projects-page__grid'>
          {filteredProjects?.map((project: Project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editProject ? handleUpdate : handleCreate}
        isLoading={createProject.isPending || updateProject.isPending}
        editData={editProject}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title='Delete Project'
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All tasks inside will also be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteProject.isPending}
      />

      <Toast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  )
}

export default ProjectsPage