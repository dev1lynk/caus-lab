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
import StockPredictionDashboard from "@/components/StockPredictionDashboard";
import CounterfactualAnalysis from "@/components/CounterfactualAnalysis";
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
  const [activeTab, setActiveTab] = useState("workflow");

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Causal AI Simulation Platform
              </h1>
              <p className="text-muted-foreground">
                Semiconductor industry causal modeling with advanced intervention simulation and analytics.
              </p>
            </div>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full justify-start md:grid md:grid-cols-5 gap-1">
              <TabsTrigger value="demo" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Demo</span>
                <span className="md:hidden">Demo</span>
              </TabsTrigger>
              <TabsTrigger value="prediction" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">ST Stock Prediction</span>
                <span className="md:hidden">Predict</span>
              </TabsTrigger>
              <TabsTrigger value="counterfactual" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Counterfactual AI</span>
                <span className="md:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="samples" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Sample Projects</span>
                <span className="md:hidden">Samples</span>
              </TabsTrigger>
              <TabsTrigger value="documentation" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Documentation</span>
                <span className="md:hidden">Docs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="demo" className="space-y-8">
            {/* Progress Steps */}
            <ProgressSteps currentStep={getCurrentStep(project.status)} />

            {/* Main Content Grid */}
            <div className="space-y-8">
              {/* Data Upload and Variable Configuration */}
              {(project.status === 'upload' || project.status === 'diagram') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <DataUpload project={project} />
                  {(project.dataRows || 0) > 0 && <VariableConfiguration project={project} isPremium={isPremium} />}
                </div>
              )}

              {/* Causal Diagram Builder */}
              {(project.status === 'diagram' || project.status === 'training' || project.status === 'complete') && 
               (project.variables || []).length > 0 && (
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
          </TabsContent>

          <TabsContent value="prediction" className="space-y-8">
            <StockPredictionDashboard project={project} />
          </TabsContent>

          <TabsContent value="counterfactual" className="space-y-8">
            <CounterfactualAnalysis />
          </TabsContent>



          <TabsContent value="samples" className="space-y-8">
            <DocumentationSection />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-8">
            <Card>
              <CardContent className="py-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Semiconductor Industry Templates
                    </h3>
                    <p className="text-muted-foreground">
                      Professional-grade causal modeling templates for chip manufacturing, supply chain optimization, and performance analysis
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Production Optimization
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                        Analyze yield rates, defect density, and manufacturing efficiency with up to 50 variables
                      </p>
                      <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                        <div>• Wafer processing parameters</div>
                        <div>• Contamination control metrics</div>
                        <div>• Equipment performance indicators</div>
                        <div>• Quality assurance variables</div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        Supply Chain Analysis
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                        Model complex supply networks with geopolitical risk factors and delivery optimization
                      </p>
                      <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                        <div>• Material sourcing variables</div>
                        <div>• Logistics and shipping metrics</div>
                        <div>• Supplier reliability factors</div>
                        <div>• Market demand indicators</div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                        Performance Engineering
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
                        Optimize chip architecture for performance, power, and thermal characteristics
                      </p>
                      <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                        <div>• Transistor density optimization</div>
                        <div>• Power consumption modeling</div>
                        <div>• Thermal management variables</div>
                        <div>• Clock frequency parameters</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-3">Premium Plan Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Up to 50 variables per project</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Advanced intervention scenarios</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Shock event simulation</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Custom causal model parameters</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Extended forecast periods (12+ months)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Interactive intervention charts</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Semiconductor industry templates</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>Priority support and consultation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
