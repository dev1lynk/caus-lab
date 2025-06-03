import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Play, Zap, TrendingUp, AlertTriangle, Target, Settings } from "lucide-react";
import type { Project, Variable } from "@shared/schema";

interface InterventionSimulatorProps {
  project: Project;
  isPremium?: boolean;
}

interface Intervention {
  id: string;
  name: string;
  type: 'gradual' | 'immediate' | 'shock';
  targetVariable: string;
  changeType: 'percentage' | 'absolute';
  changeValue: number;
  duration: number;
  startDate: string;
  description: string;
}

interface SimulationResult {
  intervention: Intervention;
  impact: {
    primary: { variable: string; change: number; };
    secondary: { variable: string; change: number; }[];
  };
  timeline: {
    date: string;
    values: Record<string, number>;
  }[];
}

export default function InterventionSimulator({ project, isPremium = false }: InterventionSimulatorProps) {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [activeIntervention, setActiveIntervention] = useState<Intervention | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Semiconductor-specific intervention templates
  const interventionTemplates = [
    {
      name: "Increase Wafer Processing Temperature",
      type: "gradual" as const,
      description: "Gradually increase processing temperature to improve crystalline structure",
      targetVariable: "wafer-temp",
      changeType: "percentage" as const,
      changeValue: 5,
      duration: 30
    },
    {
      name: "Supply Chain Disruption Shock",
      type: "shock" as const,
      description: "Sudden increase in raw material costs due to geopolitical events",
      targetVariable: "raw-material-cost",
      changeType: "percentage" as const,
      changeValue: 25,
      duration: 60
    },
    {
      name: "Equipment Upgrade Implementation",
      type: "immediate" as const,
      description: "Deploy new manufacturing equipment to improve uptime",
      targetVariable: "equipment-uptime",
      changeType: "percentage" as const,
      changeValue: 8,
      duration: 90
    },
    {
      name: "Contamination Control Enhancement",
      type: "gradual" as const,
      description: "Implement advanced cleanroom protocols",
      targetVariable: "contamination-level",
      changeType: "percentage" as const,
      changeValue: -30,
      duration: 45
    }
  ];

  const createNewIntervention = () => {
    if (!project.variables || project.variables.length === 0) {
      alert("Please upload data and configure variables first to create interventions.");
      return;
    }
    
    const newIntervention: Intervention = {
      id: `intervention-${Date.now()}`,
      name: "Custom Intervention",
      type: "gradual",
      targetVariable: project.variables[0].id,
      changeType: "percentage",
      changeValue: 10,
      duration: 30,
      startDate: new Date().toISOString().split('T')[0],
      description: "Custom intervention scenario"
    };
    setActiveIntervention(newIntervention);
  };

  const loadTemplate = (template: typeof interventionTemplates[0]) => {
    if (!project.variables || project.variables.length === 0) {
      alert("Please upload data and configure variables first to load intervention templates.");
      return;
    }
    
    // Find the target variable or use the first available variable
    const targetVar = project.variables.find(v => v.name.toLowerCase().includes(template.targetVariable.toLowerCase())) || project.variables[0];
    
    const intervention: Intervention = {
      id: `intervention-${Date.now()}`,
      name: template.name,
      type: template.type,
      targetVariable: targetVar.id,
      changeType: template.changeType,
      changeValue: template.changeValue,
      duration: template.duration,
      startDate: new Date().toISOString().split('T')[0],
      description: template.description
    };
    setActiveIntervention(intervention);
  };

  const saveIntervention = () => {
    if (activeIntervention) {
      setInterventions(prev => [...prev, activeIntervention]);
      setActiveIntervention(null);
    }
  };

  const runSimulation = async () => {
    if (!isPremium) return;
    
    if (!project.variables || project.variables.length === 0) {
      alert("Please upload data and configure variables first to run simulations.");
      return;
    }
    
    setIsSimulating(true);
    
    // Simulate running interventions (mock implementation)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: SimulationResult[] = interventions.map(intervention => ({
      intervention,
      impact: {
        primary: {
          variable: intervention.targetVariable,
          change: intervention.changeValue
        },
        secondary: project.variables.slice(0, 3).map(v => ({
          variable: v.id,
          change: Math.random() * intervention.changeValue * 0.3
        }))
      },
      timeline: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        values: project.variables.reduce((acc, v) => {
          acc[v.id] = 100 + (Math.random() - 0.5) * 20;
          return acc;
        }, {} as Record<string, number>)
      }))
    }));
    
    setSimulationResults(mockResults);
    setIsSimulating(false);
  };

  const getVariableName = (variableId: string) => {
    return project.variables?.find(v => v.id === variableId)?.name || variableId;
  };

  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Advanced Intervention Simulator
            <Badge variant="outline">Premium Feature</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 opacity-60">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Unlock Advanced Simulations
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run multiple intervention scenarios, shock testing, and detailed impact analysis
            </p>
            <Button>Upgrade to Premium</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Intervention Simulator
            </div>
            <Badge variant="default" className="bg-green-500">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="builder">Build Scenario</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="queue">Intervention Queue</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6">
              {activeIntervention ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="intervention-name">Intervention Name</Label>
                        <Input
                          id="intervention-name"
                          value={activeIntervention.name}
                          onChange={(e) => setActiveIntervention({
                            ...activeIntervention,
                            name: e.target.value
                          })}
                          placeholder="Enter intervention name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="intervention-type">Intervention Type</Label>
                        <Select
                          value={activeIntervention.type}
                          onValueChange={(value: 'gradual' | 'immediate' | 'shock') =>
                            setActiveIntervention({
                              ...activeIntervention,
                              type: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gradual">Gradual Change</SelectItem>
                            <SelectItem value="immediate">Immediate Implementation</SelectItem>
                            <SelectItem value="shock">Market Shock Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="target-variable">Target Variable</Label>
                        <Select
                          value={activeIntervention.targetVariable}
                          onValueChange={(value) =>
                            setActiveIntervention({
                              ...activeIntervention,
                              targetVariable: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {project.variables?.filter(v => v.type === 'input' || v.type === 'external').map((variable) => (
                              <SelectItem key={variable.id} value={variable.id}>
                                {variable.name}
                              </SelectItem>
                            )) || []}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="change-type">Change Type</Label>
                        <Select
                          value={activeIntervention.changeType}
                          onValueChange={(value: 'percentage' | 'absolute') =>
                            setActiveIntervention({
                              ...activeIntervention,
                              changeType: value
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage Change</SelectItem>
                            <SelectItem value="absolute">Absolute Value</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="change-value">
                          Change Amount ({activeIntervention.changeType === 'percentage' ? '%' : 'units'})
                        </Label>
                        <div className="space-y-2">
                          <Slider
                            value={[activeIntervention.changeValue]}
                            onValueChange={([value]) =>
                              setActiveIntervention({
                                ...activeIntervention,
                                changeValue: value
                              })
                            }
                            min={-50}
                            max={50}
                            step={0.1}
                            className="w-full"
                          />
                          <div className="text-center">
                            <span className="text-lg font-semibold">
                              {activeIntervention.changeValue > 0 ? '+' : ''}
                              {activeIntervention.changeValue.toFixed(1)}
                              {activeIntervention.changeType === 'percentage' ? '%' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={activeIntervention.duration}
                          onChange={(e) => setActiveIntervention({
                            ...activeIntervention,
                            duration: parseInt(e.target.value) || 0
                          })}
                          min="1"
                          max="365"
                        />
                      </div>

                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={activeIntervention.startDate}
                          onChange={(e) => setActiveIntervention({
                            ...activeIntervention,
                            startDate: e.target.value
                          })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={activeIntervention.description}
                          onChange={(e) => setActiveIntervention({
                            ...activeIntervention,
                            description: e.target.value
                          })}
                          placeholder="Describe the intervention scenario..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={saveIntervention}>
                      <Target className="h-4 w-4 mr-2" />
                      Save Intervention
                    </Button>
                    <Button variant="outline" onClick={() => setActiveIntervention(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Create New Intervention
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Build custom intervention scenarios to test impact on your variables
                  </p>
                  <Button onClick={createNewIntervention}>
                    Create New Intervention
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interventionTemplates.map((template, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant={
                          template.type === 'shock' ? 'destructive' :
                          template.type === 'immediate' ? 'default' : 'secondary'
                        } className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Change:</span>
                        <span className="font-medium">
                          {template.changeValue > 0 ? '+' : ''}{template.changeValue}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{template.duration} days</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => loadTemplate(template)}
                      >
                        Load Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="queue" className="space-y-6">
              {interventions.length > 0 ? (
                <div className="space-y-4">
                  {interventions.map((intervention, index) => (
                    <Card key={intervention.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{intervention.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getVariableName(intervention.targetVariable)} • {intervention.changeValue > 0 ? '+' : ''}{intervention.changeValue}% • {intervention.duration} days
                            </p>
                          </div>
                          <Badge variant={
                            intervention.type === 'shock' ? 'destructive' :
                            intervention.type === 'immediate' ? 'default' : 'secondary'
                          }>
                            {intervention.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isSimulating ? 'Running Simulation...' : 'Run All Simulations'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Interventions Queued
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create intervention scenarios to see them listed here
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {simulationResults.length > 0 ? (
                <div className="space-y-6">
                  {simulationResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{result.intervention.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-primary/5 rounded-lg">
                            <div className="text-sm font-medium text-primary mb-1">Primary Impact</div>
                            <div className="text-xl font-bold">
                              {result.impact.primary.change > 0 ? '+' : ''}{result.impact.primary.change.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getVariableName(result.impact.primary.variable)}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-secondary/5 rounded-lg">
                            <div className="text-sm font-medium text-secondary mb-1">Secondary Effects</div>
                            <div className="space-y-1">
                              {result.impact.secondary.slice(0, 2).map((effect, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">
                                    {effect.change > 0 ? '+' : ''}{effect.change.toFixed(1)}%
                                  </span>
                                  <span className="text-muted-foreground ml-1">
                                    {getVariableName(effect.variable)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 bg-accent/5 rounded-lg">
                            <div className="text-sm font-medium text-accent mb-1">Timeline</div>
                            <div className="text-xl font-bold">{result.intervention.duration} days</div>
                            <div className="text-xs text-muted-foreground">
                              {result.intervention.type} implementation
                            </div>
                          </div>
                        </div>

                        {/* Interactive Chart Placeholder */}
                        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium text-foreground">Interactive Time Series Chart</p>
                            <p className="text-xs text-muted-foreground">
                              Shows intervention impact over time with confidence intervals
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No Simulation Results
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Run intervention simulations to see detailed results and impact analysis
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}