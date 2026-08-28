import Navigation from "@/components/Navigation";
import ProjectWorkflow from "@/components/ProjectWorkflow";
import WorkflowGuidance from "@/components/WorkflowGuidance";

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CAUS Lab Platform
          </h1>
          <p className="text-muted-foreground">
            Follow the complete CAUS Lab process from data upload to actionable insights.
          </p>
        </div>

        <div className="space-y-8">
          <ProjectWorkflow />
          <WorkflowGuidance />
        </div>
      </main>
    </div>
  );
}