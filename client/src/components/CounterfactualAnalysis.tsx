import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, TrendingUp, Brain, AlertCircle, Play, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CounterfactualResult {
  status: 'success' | 'error';
  scenario_name?: string;
  original_series?: number[][];
  counterfactual_series?: number[][];
  variable_names?: string[];
  intervention?: {
    variable: string;
    value: number;
    time: number;
  };
  message?: string;
}

interface PredefinedScenario {
  name: string;
  description: string;
  intervention_variable: string;
  intervention_value: number;
  intervention_time: number;
  category: string;
}

interface ModelInfo {
  model_id: string;
  variables: string[];
  input_dim: number;
  seq_len: number;
  predefined_scenarios: PredefinedScenario[];
}

export default function CounterfactualAnalysis() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [predefinedScenarios, setPredefinedScenarios] = useState<PredefinedScenario[]>([]);
  const [sampleData, setSampleData] = useState<number[][] | null>(null);
  const [counterfactualResult, setCounterfactualResult] = useState<CounterfactualResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [customScenario, setCustomScenario] = useState({
    intervention_variable: "",
    intervention_value: 0,
    intervention_time: 10,
    scenario_name: ""
  });
  const [activeTab, setActiveTab] = useState("predefined");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModelInfo();
    loadPredefinedScenarios();
    loadSampleData();
  }, []);

  const loadModelInfo = async () => {
    try {
      const response = await fetch('/api/model-info');
      if (response.ok) {
        const info = await response.json();
        setModelInfo(info);
      } else {
        setError("T-NCM-VAE model not available. Please configure the Hugging Face token.");
      }
    } catch (err) {
      setError("Failed to load model information");
    }
  };

  const loadPredefinedScenarios = async () => {
    try {
      const response = await fetch('/api/predefined-scenarios');
      if (response.ok) {
        const data = await response.json();
        setPredefinedScenarios(data.scenarios);
      }
    } catch (err) {
      console.error("Failed to load predefined scenarios:", err);
    }
  };

  const loadSampleData = async () => {
    try {
      const response = await fetch('/api/sample-data');
      if (response.ok) {
        const data = await response.json();
        setSampleData(data.data);
      }
    } catch (err) {
      console.error("Failed to load sample data:", err);
    }
  };

  const generateCounterfactual = async (scenarioData: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const requestData = {
        input_data: sampleData,
        ...scenarioData
      };

      const result = await apiRequest('/api/counterfactual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      setCounterfactualResult(result);
      
      if (result.status === 'error') {
        setError(result.message || 'Failed to generate counterfactual');
      }
    } catch (err) {
      setError('Failed to generate counterfactual analysis');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const runPredefinedScenario = () => {
    const scenario = predefinedScenarios.find(s => s.name === selectedScenario);
    if (!scenario) return;

    generateCounterfactual({
      intervention_variable: scenario.intervention_variable,
      intervention_value: scenario.intervention_value,
      intervention_time: scenario.intervention_time,
      scenario_name: scenario.name
    });
  };

  const runCustomScenario = () => {
    if (!customScenario.intervention_variable || !customScenario.scenario_name) {
      setError('Please fill in all required fields for custom scenario');
      return;
    }

    generateCounterfactual(customScenario);
  };

  const renderVisualization = () => {
    if (!counterfactualResult || counterfactualResult.status !== 'success') return null;

    const { original_series, counterfactual_series, variable_names, intervention } = counterfactualResult;
    if (!original_series || !counterfactual_series || !variable_names) return null;

    // Calculate impact metrics
    const interventionVarIndex = variable_names.indexOf(intervention?.variable || '');
    const impactAtIntervention = interventionVarIndex >= 0 
      ? ((counterfactual_series[intervention?.time || 0][interventionVarIndex] - original_series[intervention?.time || 0][interventionVarIndex]) / original_series[intervention?.time || 0][interventionVarIndex]) * 100
      : 0;

    const finalImpact = interventionVarIndex >= 0
      ? ((counterfactual_series[19][interventionVarIndex] - original_series[19][interventionVarIndex]) / original_series[19][interventionVarIndex]) * 100
      : 0;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Intervention Variable</p>
                  <p className="text-lg font-bold">{intervention?.variable?.replace(/_/g, ' ').toUpperCase()}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Immediate Impact</p>
                  <p className={`text-lg font-bold ${impactAtIntervention >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {impactAtIntervention > 0 ? '+' : ''}{impactAtIntervention.toFixed(1)}%
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Final Impact</p>
                  <p className={`text-lg font-bold ${finalImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {finalImpact > 0 ? '+' : ''}{finalImpact.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time Series Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Counterfactual Analysis Visualization
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Scenario: {counterfactualResult.scenario_name}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs max-w-md">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded">
                    <div className="font-medium">Original Timeline</div>
                    <div className="text-blue-600">20 time steps baseline</div>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded">
                    <div className="font-medium">Counterfactual</div>
                    <div className="text-green-600">With intervention applied</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Intervention at time step {intervention?.time}: {intervention?.variable} = {intervention?.value}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Variable Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {variable_names.slice(0, 9).map((variable, index) => {
                const originalFinal = original_series[19][index];
                const counterfactualFinal = counterfactual_series[19][index];
                const impact = ((counterfactualFinal - originalFinal) / originalFinal) * 100;
                
                return (
                  <div key={variable} className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium">{variable.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-muted-foreground">
                        {originalFinal.toFixed(3)} → {counterfactualFinal.toFixed(3)}
                      </div>
                      <div className={`text-sm font-bold ${impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (error && !modelInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Advanced Counterfactual Analysis
            <Badge variant="outline">T-NCM-VAE Model</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
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
              <Brain className="h-5 w-5 mr-2 text-primary" />
              Advanced Counterfactual Analysis
            </div>
            <Badge variant="default" className="bg-purple-500">T-NCM-VAE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="predefined">Predefined Scenarios</TabsTrigger>
              <TabsTrigger value="custom">Custom Scenario</TabsTrigger>
            </TabsList>

            <TabsContent value="predefined" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario-select">Select Scenario</Label>
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a predefined scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedScenarios.map((scenario) => (
                        <SelectItem key={scenario.name} value={scenario.name}>
                          {scenario.name} - {scenario.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedScenario && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    {(() => {
                      const scenario = predefinedScenarios.find(s => s.name === selectedScenario);
                      return scenario ? (
                        <div className="space-y-2">
                          <h4 className="font-medium">{scenario.name}</h4>
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="font-medium">Variable:</span> {scenario.intervention_variable}
                            </div>
                            <div>
                              <span className="font-medium">Value:</span> {scenario.intervention_value}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {scenario.intervention_time}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <Button 
                  onClick={runPredefinedScenario}
                  disabled={!selectedScenario || isGenerating || !sampleData}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating Counterfactual..." : "Run Scenario Analysis"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                    id="scenario-name"
                    value={customScenario.scenario_name}
                    onChange={(e) => setCustomScenario(prev => ({ ...prev, scenario_name: e.target.value }))}
                    placeholder="Enter scenario name"
                  />
                </div>

                <div>
                  <Label htmlFor="intervention-variable">Intervention Variable</Label>
                  <Select 
                    value={customScenario.intervention_variable} 
                    onValueChange={(value) => setCustomScenario(prev => ({ ...prev, intervention_variable: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variable to intervene" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelInfo?.variables.map((variable) => (
                        <SelectItem key={variable} value={variable}>
                          {variable.replace(/_/g, ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="intervention-value">Intervention Value</Label>
                  <Input
                    id="intervention-value"
                    type="number"
                    step="0.1"
                    value={customScenario.intervention_value}
                    onChange={(e) => setCustomScenario(prev => ({ ...prev, intervention_value: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter intervention value"
                  />
                </div>

                <div>
                  <Label htmlFor="intervention-time">Intervention Time (0-19)</Label>
                  <Input
                    id="intervention-time"
                    type="number"
                    min="0"
                    max="19"
                    value={customScenario.intervention_time}
                    onChange={(e) => setCustomScenario(prev => ({ ...prev, intervention_time: parseInt(e.target.value) || 10 }))}
                    placeholder="Time step for intervention"
                  />
                </div>
              </div>

              <Button 
                onClick={runCustomScenario}
                disabled={isGenerating || !sampleData || !customScenario.intervention_variable || !customScenario.scenario_name}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {isGenerating ? "Generating Counterfactual..." : "Run Custom Analysis"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {counterfactualResult && renderVisualization()}
    </div>
  );
}