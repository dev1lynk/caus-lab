import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play, FileText, TrendingUp, Zap, Building2 } from "lucide-react";
import { sampleProjects } from "@/data/sampleProjects";
import type { SampleProject } from "@/data/sampleProjects";

export default function SampleProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<SampleProject | null>(null);

  const downloadSampleCSV = (project: SampleProject) => {
    const headers = Object.keys(project.sampleData[0]);
    const csvContent = [
      headers.join(','),
      ...project.sampleData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}-sample-data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleProject = (project: SampleProject) => {
    console.log('Loading sample project:', project.name);
    // Integration point for loading sample projects
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Sample Projects Library
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore real-world semiconductor industry use cases with pre-built datasets, 
          causal models, and proven methodologies. Download sample data or load complete projects instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {project.industry === 'Semiconductor Manufacturing' && <Building2 className="w-5 h-5 text-blue-600" />}
                  {project.industry === 'Supply Chain' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {project.industry === 'Chip Design' && <Zap className="w-5 h-5 text-purple-600" />}
                  {project.industry === 'Financial Modeling' && <FileText className="w-5 h-5 text-orange-600" />}
                  <Badge variant="secondary" className="text-xs">
                    {project.industry}
                  </Badge>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {project.variables.length} variables
                </div>
              </div>
              <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium mb-2">Key Variables:</h5>
                  <div className="flex flex-wrap gap-1">
                    {project.variables.slice(0, 4).map((variable) => (
                      <Badge 
                        key={variable.id} 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: variable.color, color: variable.color }}
                      >
                        {variable.name}
                      </Badge>
                    ))}
                    {project.variables.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.variables.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Dataset Info:</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="font-medium">Rows:</span> {project.sampleData.length}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="font-medium">Features:</span> {Object.keys(project.sampleData[0] || {}).length}
                    </div>
                  </div>
                </div>

                {project.results && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Expected Results:</h5>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-xs">
                      <div className="flex justify-between">
                        <span>Model Accuracy:</span>
                        <span className="font-medium">{project.results.metrics.modelAccuracy}%</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Causal Strength:</span>
                        <span className="font-medium">{project.results.metrics.causalStrength}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => downloadSampleCSV(project)}
                  className="flex-1 text-xs"
                  variant="outline"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download CSV
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => loadSampleProject(project)}
                  className="flex-1 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Load Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Guide */}
      <Card className="mt-8 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Choose a Sample Project</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select from our curated library of semiconductor industry projects
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Download or Load</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Download CSV data for external use or load directly into the platform
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Start Analyzing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Explore causal relationships and run scenario simulations immediately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Templates */}
      <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle>Industry-Specific Templates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Pre-configured project templates for common semiconductor use cases
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">Wafer Fabrication</h4>
              <ul className="text-sm space-y-1">
                <li>• Yield optimization models</li>
                <li>• Defect prediction analysis</li>
                <li>• Process parameter tuning</li>
                <li>• Equipment performance tracking</li>
              </ul>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">Supply Chain Analytics</h4>
              <ul className="text-sm space-y-1">
                <li>• Supplier risk assessment</li>
                <li>• Inventory optimization</li>
                <li>• Demand forecasting</li>
                <li>• Logistics cost modeling</li>
              </ul>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">Market Analysis</h4>
              <ul className="text-sm space-y-1">
                <li>• Stock price prediction</li>
                <li>• Competitive analysis</li>
                <li>• Market trend modeling</li>
                <li>• Financial risk assessment</li>
              </ul>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-600 mb-2">R&D Performance</h4>
              <ul className="text-sm space-y-1">
                <li>• Innovation pipeline tracking</li>
                <li>• Technology roadmap planning</li>
                <li>• Patent analysis</li>
                <li>• Time-to-market optimization</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}