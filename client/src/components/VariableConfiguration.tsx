import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, AlertTriangle } from "lucide-react";
import type { Project, Variable } from "@shared/schema";

interface VariableConfigurationProps {
  project: Project;
}

const variableTypeColors = {
  target: { bg: "bg-blue-100", dot: "bg-blue-500", text: "text-blue-700" },
  input: { bg: "bg-green-100", dot: "bg-green-500", text: "text-green-700" },
  mediator: { bg: "bg-purple-100", dot: "bg-purple-500", text: "text-purple-700" },
  external: { bg: "bg-red-100", dot: "bg-red-500", text: "text-red-700" },
};

const variableTypeLabels = {
  target: "Target",
  input: "Input", 
  mediator: "Mediator",
  external: "External",
};

interface VariableConfigurationProps {
  project: Project;
  isPremium?: boolean;
}

export default function VariableConfiguration({ project, isPremium = false }: VariableConfigurationProps) {
  const variables = project.variables || [];
  const maxVariables = isPremium ? 50 : 5;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Variable Configuration
          <Badge variant="secondary" className="text-xs">
            {variables.length}/{maxVariables} variables
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {variables.map((variable) => {
            const colors = variableTypeColors[variable.type];
            return (
              <div
                key={variable.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg transition-all hover:bg-muted"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 ${colors.dot} rounded-full mr-3`} />
                  <span className="font-medium text-foreground">{variable.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${colors.bg} ${colors.text}`}
                  >
                    {variableTypeLabels[variable.type]}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {variables.length >= maxVariables && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Free plan limit reached. Upgrade to add more variables.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h5 className="text-sm font-medium text-foreground">Variable Types</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-muted-foreground">Target: Main outcome variable</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Input: Controllable factors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-muted-foreground">Mediator: Intermediate variables</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-muted-foreground">External: Environmental factors</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
