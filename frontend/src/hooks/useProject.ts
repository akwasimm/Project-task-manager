import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/project.api'
import type { CreateProjectRequest, UpdateProjectRequest, AddMemberRequest } from '../types/project.types'

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn:  projectsApi.getAll,
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn:  () => projectsApi.getById(id),
    enabled:  !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export const useAddMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: AddMemberRequest }) =>
      projectsApi.addMember(projectId, data),
    onSuccess: (_: any, variables: { projectId: string; data: AddMemberRequest }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] })
    },
  })
}

export const useRemoveMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      projectsApi.removeMember(projectId, userId),
    onSuccess: (_: any, variables: { projectId: string; userId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] })
    },
  })
}