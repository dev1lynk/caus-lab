import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Project, InsertProject } from "@shared/schema";

export function useProject(projectId: number | null) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
    refetchInterval: (data) => {
      // Poll every 2 seconds if training is in progress
      return data.state.data?.status === 'training' ? 2000 : false;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: InsertProject) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      return response.json() as Promise<Project>;
    },
    onSuccess: (newProject) => {
      // Navigate to the new project
      setLocation(`/project/${newProject.id}`);
      queryClient.setQueryData([`/api/projects/${newProject.id}`], newProject);
      
      toast({
        title: "Project created",
        description: "Your new CAUS Lab project has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Project> }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      
      return response.json() as Promise<Project>;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData([`/api/projects/${updatedProject.id}`], updatedProject);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    project: project as Project | undefined,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    updateProject: (updates: Partial<Project>) => {
      if (projectId) {
        updateProjectMutation.mutate({ id: projectId, updates });
      }
    },
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
  };
}
