import { useState } from "react";
import Navigation from "@/components/Navigation";
import SampleProjectsSection from "@/components/SampleProjectsSection";
import DocumentationContent from "@/components/DocumentationContent";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("samples");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Projects & Documentation
              </h1>
              <p className="text-muted-foreground">
                Explore sample projects and comprehensive documentation for the Causal AI platform
              </p>
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