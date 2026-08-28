import Navigation from "@/components/Navigation";
import ProjectWorkflow from "@/components/ProjectWorkflow";
import WorkflowGuidance from "@/components/WorkflowGuidance";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

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

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-border pt-8 text-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Have a causal question?</h2>
            <p className="mt-1 text-muted-foreground">
              Ask Anything and explore how CAUS Lab can help you reason about it.
            </p>
          </div>
          <Link href="/ask">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Ask Anything
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}