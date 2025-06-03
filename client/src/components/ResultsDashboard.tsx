import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Download, Share, ArrowUp, TrendingUp, Activity, Clock } from "lucide-react";
import type { Project } from "@shared/schema";

interface ResultsDashboardProps {
  project: Project;
}

export default function ResultsDashboard({ project }: ResultsDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateResultsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/generate-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate results');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate results",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (project.status === 'complete' && !project.results) {
      generateResultsMutation.mutate();
    }
  }, [project.status, project.results]);

  if (!project.results) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="py-8 text-center">
          <div className="space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Generating analysis results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const results = project.results;
  const expirationHours = project.expiresAt ? 
    Math.max(0, Math.floor((new Date(project.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))) : 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Analysis Results
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Expires in {expirationHours}h
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Executive Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-semibold text-foreground mb-4">Executive Summary</h4>
              <div className="prose prose-sm text-muted-foreground">
                <p className="mb-3">Based on your data analysis and causal model, here are the key insights:</p>
                <ul className="space-y-2">
                  <li><strong>Marketing Impact:</strong> Strong correlation identified with revenue generation patterns.</li>
                  <li><strong>Sales Team Efficiency:</strong> Current operations showing high performance metrics.</li>
                  <li><strong>Support Correlation:</strong> Customer satisfaction metrics indicate room for optimization.</li>
                  <li><strong>Seasonal Patterns:</strong> Time-series analysis reveals consistent growth trends.</li>
                </ul>
                <p className="mt-3 text-sm">{results.summary}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Revenue Forecast</span>
                <ArrowUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {results.metrics.revenueForcast}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">Next 30 days</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Model Accuracy</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {results.metrics.modelAccuracy}%
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Training score</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Causal Strength</span>
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {results.metrics.causalStrength}
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Average correlation</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Series Forecast Chart */}
          <div className="p-4 border border-border rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-4">Revenue Forecast (30 Days)</h5>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Time Series Chart</p>
                <p className="text-xs text-muted-foreground">Historical & Predicted Revenue</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Historical</span>
              <span>Predicted</span>
              <span>Confidence Interval</span>
            </div>
          </div>

          {/* Variable Impact Chart */}
          <div className="p-4 border border-border rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-4">Variable Impact Analysis</h5>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Impact Analysis Chart</p>
                <p className="text-xs text-muted-foreground">Variable Importance</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              {Object.entries(results.variableImpact).slice(0, 4).map(([variable, impact], index) => {
                const colors = ['bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                return (
                  <div key={variable} className="flex items-center">
                    <div className={`w-3 h-3 ${colors[index]} rounded mr-2`} />
                    <span className="text-muted-foreground">{variable}: {Math.round(impact)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className="p-4 border border-border rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-4">Variable Correlations</h5>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Correlation Matrix</p>
                <p className="text-xs text-muted-foreground">Variable Relationships</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Weak (-1.0)</span>
                <span>Moderate (0.0)</span>
                <span>Strong (1.0)</span>
              </div>
            </div>
          </div>

          {/* Sensitivity Analysis */}
          <div className="p-4 border border-border rounded-lg">
            <h5 className="text-sm font-semibold text-foreground mb-4">Sensitivity Analysis</h5>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Sensitivity Chart</p>
                <p className="text-xs text-muted-foreground">Impact Scenarios</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {project.variables.slice(0, 3).map((variable, index) => {
                const impacts = ['+$8.4K', '+$5.2K', '+$2.1K'];
                const changes = ['+10%', '+1 person', '-20%'];
                return (
                  <div key={variable.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{variable.name} {changes[index]}</span>
                    <span className="text-green-600 font-medium">{impacts[index]} revenue</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium Features Teaser */}
        <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Get Deeper Insights</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock variable-by-variable analysis, scenario comparisons, and advanced forecasting models.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Individual variable deep-dive analysis</li>
                <li>• Multiple scenario comparison</li>
                <li>• Extended forecast periods (12+ months)</li>
                <li>• Custom model parameters</li>
                <li>• API access and data exports</li>
              </ul>
            </div>
            <div className="text-center">
              <Button className="mb-2">
                Upgrade Now
              </Button>
              <div className="text-xs text-muted-foreground">Starting at $29/month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
