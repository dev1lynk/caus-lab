import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Play, Info } from "lucide-react";
import type { Project } from "@shared/schema";

interface ModelTrainingProps {
  project: Project;
}

export default function ModelTraining({ project }: ModelTrainingProps) {
  const [trainingConfig, setTrainingConfig] = useState("standard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const trainMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.id}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: trainingConfig }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start training');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Training started",
        description: "Your AI model is now training on AWS SageMaker. This typically takes 2-5 minutes.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: () => {
      toast({
        title: "Training failed",
        description: "Failed to start model training. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    switch (project.status) {
      case 'training':
        return (
          <Badge variant="default" className="bg-blue-500">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-dot mr-2" />
            Training in Progress
          </Badge>
        );
      case 'complete':
        return (
          <Badge variant="default" className="bg-green-500">
            <div className="w-2 h-2 bg-white rounded-full mr-2" />
            Training Complete
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Ready to Train
          </Badge>
        );
    }
  };

  const variables = project.variables || [];
  const causalLinks = project.causalLinks || [];
  const dataRows = project.dataRows || 0;
  const canTrain = variables.length > 0 &&
                   causalLinks.length > 0 &&
                   dataRows > 0 &&
                   project.status !== 'training';

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          AI Model Training
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Data Points</span>
            <span className="text-sm font-medium text-foreground">
              {dataRows.toLocaleString()} rows
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Variables</span>
            <span className="text-sm font-medium text-foreground">
              {variables.length} connected
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Causal Links</span>
            <span className="text-sm font-medium text-foreground">
              {causalLinks.length} defined
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Model Type</span>
            <span className="text-sm font-medium text-foreground">
              Time Series + Causal
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Training Configuration
          </label>
          <Select value={trainingConfig} onValueChange={setTrainingConfig}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Training (Free)</SelectItem>
              <SelectItem value="advanced" disabled>Advanced Training (Premium)</SelectItem>
              <SelectItem value="custom" disabled>Custom Parameters (Enterprise)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {project.status === 'complete' && project.trainedModel ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Model training completed with {(project.trainedModel.accuracy * 100).toFixed(1)}% accuracy.
              Ready for simulation and results generation.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Button
              className="w-full"
              onClick={() => trainMutation.mutate()}
              disabled={!canTrain || trainMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              {trainMutation.isPending 
                ? "Starting Training..." 
                : "Start AI Training on AWS SageMaker"
              }
            </Button>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Training typically takes 2-5 minutes. You'll be notified when complete.
              </AlertDescription>
            </Alert>
          </>
        )}

        {project.status === 'training' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Training Progress</span>
              <span className="text-foreground font-medium">Analyzing causal relationships...</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: "75%" }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
