import { useState } from "react";
import Navigation from "@/components/Navigation";
import ProjectWorkflow from "@/components/ProjectWorkflow";
import SampleProjectsSection from "@/components/SampleProjectsSection";
import DocumentationContent from "@/components/DocumentationContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState("workflow");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Caus Lab Platform
          </h1>
          <p className="text-muted-foreground">
            Explore our workflow, sample projects, and comprehensive documentation
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full justify-start md:grid md:grid-cols-3 gap-1">
              <TabsTrigger value="workflow" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Project Workflow</span>
                <span className="md:hidden">Workflow</span>
              </TabsTrigger>
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

          <TabsContent value="workflow" className="space-y-8">
            <ProjectWorkflow />
          </TabsContent>

          <TabsContent value="samples" className="space-y-8">
            <SampleProjectsSection />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-8">
            <DocumentationContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}