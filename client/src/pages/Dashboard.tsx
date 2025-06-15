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

import STStockPredictionDashboard from "@/components/STStockPredictionDashboard";
import CounterfactualAnalysis from "@/components/CounterfactualAnalysis";
import StockPriceHeader from "@/components/StockPriceHeader";
import VariableImpactAnalysis from "@/components/VariableImpactAnalysis";
import ProjectWorkflow from "@/components/ProjectWorkflow";
import SampleProjectsSection from "@/components/SampleProjectsSection";
import DocumentationContent from "@/components/DocumentationContent";
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
  const [isPremium, setIsPremium] = useState(false); // Toggle for premium features
  const [activeTab, setActiveTab] = useState("samples");

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

  const maxVariables = isPremium ? 50 : 5;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                STM Stock Prediction Platform
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <StockPriceHeader />
              <div className="flex items-center space-x-3">
                <Badge variant={isPremium ? "default" : "secondary"}>
                  {isPremium ? "Premium Plan" : "Free Plan"}
                </Badge>
                <button
                  onClick={() => setIsPremium(!isPremium)}
                  className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                >
                  {isPremium ? "Switch to Free" : "Upgrade to Premium"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full justify-start md:grid md:grid-cols-2 gap-1">
              <TabsTrigger value="samples" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Sample Projects</span>
                <span className="md:hidden">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Documentation</span>
                <span className="md:hidden">Docs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="samples" className="space-y-8">
            <SampleProjectsSection />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-8">
            <DocumentationContent />
          </TabsContent>
        </Tabs>
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
