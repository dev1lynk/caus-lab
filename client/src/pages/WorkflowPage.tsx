import Navigation from "@/components/Navigation";
import ProjectWorkflow from "@/components/ProjectWorkflow";

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectWorkflow />
      </main>
    </div>
  );
}