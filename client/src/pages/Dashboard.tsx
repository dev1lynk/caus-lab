import { useParams } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import ProgressSteps from "@/components/ProgressSteps";
import DataUpload from "@/components/DataUpload";
import VariableConfiguration from "@/components/VariableConfiguration";
import CausalDiagramBuilder from "@/components/CausalDiagramBuilder";
import ModelTraining from "@/components/ModelTraining";
import ScenarioSimulation from "@/components/ScenarioSimulation";
import ResultsDashboard from "@/components/ResultsDashboard";
import DocumentationSection from "@/components/DocumentationSection";
import InterventionSimulator from "@/components/InterventionSimulator";
import Footer from "@/components/Footer";
import { useProject } from "@/hooks/useProject";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const params = useParams();
  const projectId = params.id ? parseInt(params.id) : null;
  const { project, createProject, isLoading } = useProject(projectId);

  useEffect(() => {
    if (!projectId && !project) {
      // Create initial project
      createProject({ name: "New Causal AI Project", status: "upload" });
    }
  }, [projectId, project, createProject]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Creating your project...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Causal AI Simulation Platform
          </h1>
          <p className="text-muted-foreground">
            Upload your data, define causal relationships, and simulate intervention scenarios with AI-powered forecasting.
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps currentStep={getCurrentStep(project.status)} />

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Data Upload and Variable Configuration */}
          {(project.status === 'upload' || project.status === 'diagram') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DataUpload project={project} />
              {project.dataRows > 0 && <VariableConfiguration project={project} />}
            </div>
          )}

          {/* Causal Diagram Builder */}
          {(project.status === 'diagram' || project.status === 'training' || project.status === 'complete') && 
           project.variables.length > 0 && (
            <CausalDiagramBuilder project={project} />
          )}

          {/* Model Training and Simulation */}
          {(project.status === 'training' || project.status === 'complete') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ModelTraining project={project} />
              <ScenarioSimulation project={project} />
            </div>
          )}

          {/* Results Dashboard */}
          {project.status === 'complete' && project.results && (
            <ResultsDashboard project={project} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function getCurrentStep(status: string): number {
  switch (status) {
    case 'upload': return 1;
    case 'diagram': return 2;
    case 'training': return 3;
    case 'complete': return 4;
    default: return 1;
  }
}
