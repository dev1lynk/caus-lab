import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileText, Play, Zap, TrendingUp } from "lucide-react";
import { sampleProjects } from "@/data/sampleProjects";
import type { SampleProject } from "@/data/sampleProjects";

export default function DocumentationSection() {
  const [selectedProject, setSelectedProject] = useState<SampleProject | null>(null);

  const downloadSampleCSV = (project: SampleProject) => {
    // Convert sample data to CSV format
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
    // This would integrate with the main application to load the sample project
    console.log('Loading sample project:', project.name);
    // In a real implementation, this would create a new project with the sample data
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Sample Projects & Documentation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Explore real-world semiconductor industry use cases and download sample datasets
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Premium Examples
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Sample Projects</TabsTrigger>
              <TabsTrigger value="variables">Variable Guide</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sampleProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {project.industry}
                          </Badge>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          {project.variables.length} variables
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium">Key Variables:</h5>
                        <div className="flex flex-wrap gap-1">
                          {project.variables.slice(0, 4).map((variable) => (
                            <Badge 
                              key={variable.id} 
                              variant="outline" 
                              className="text-xs"
                              style={{ borderColor: variable.color }}
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

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => downloadSampleCSV(project)}
                          className="text-xs flex-1"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download CSV
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => loadSampleProject(project)}
                          className="text-xs flex-1"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Load Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  These sample projects demonstrate advanced causal modeling techniques used in the semiconductor industry. 
                  Premium plans support up to 50 variables and complex multi-layered causal relationships.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="variables" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Variable Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/50 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Production</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Manufacturing metrics</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/50 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Supply Chain</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Logistics & sourcing</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-950/50 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Technology</span>
                        </div>
                        <span className="text-xs text-muted-foreground">R&D and design</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/50 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Market</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Demand & pricing</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/50 rounded">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Financial</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Cost & revenue</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Variable Types</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Target Variables</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Primary outcomes you want to optimize or predict (e.g., Yield Rate, Revenue)
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Input Variables</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Controllable factors you can adjust (e.g., Temperature, Process Parameters)
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">Mediator Variables</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Intermediate factors that transmit effects (e.g., Defect Density)
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                          <span className="text-sm font-medium">External Variables</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uncontrollable environmental factors (e.g., Market Conditions)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-primary" />
                      Quick Start Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</div>
                        <div>
                          <div className="font-medium">Upload Your Data</div>
                          <div className="text-muted-foreground">CSV with time-series data, up to 50 variables (Premium)</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</div>
                        <div>
                          <div className="font-medium">Configure Variables</div>
                          <div className="text-muted-foreground">Set types, categories, and relationships</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</div>
                        <div>
                          <div className="font-medium">Build Causal Model</div>
                          <div className="text-muted-foreground">Define causal links and strengths</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</div>
                        <div>
                          <div className="font-medium">Train & Simulate</div>
                          <div className="text-muted-foreground">Run interventions and analyze results</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-3 text-xs">
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="font-medium mb-1">Data Quality</div>
                        <div className="text-muted-foreground">Ensure consistent time intervals and minimal missing values</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="font-medium mb-1">Variable Selection</div>
                        <div className="text-muted-foreground">Include both leading and lagging indicators for comprehensive analysis</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="font-medium mb-1">Causal Relationships</div>
                        <div className="text-muted-foreground">Start with domain knowledge, then validate with data patterns</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="font-medium mb-1">Model Validation</div>
                        <div className="text-muted-foreground">Test interventions on historical data before implementing</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}