import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp } from "lucide-react";
import type { Project } from "@shared/schema";

interface ScenarioSimulationProps {
  project: Project;
}

export default function ScenarioSimulation({ project }: ScenarioSimulationProps) {
  const [interventionType, setInterventionType] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [changeAmount, setChangeAmount] = useState([20]);
  const [simulationPeriod, setSimulationPeriod] = useState("30");

  const isPremiumFeature = true; // Mock premium feature for MVP

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Scenario Simulation
          <Badge variant="outline" className="text-xs">
            Premium Feature
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`space-y-4 ${isPremiumFeature ? 'opacity-60' : ''}`}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Intervention Type
            </label>
            <Select 
              value={interventionType} 
              onValueChange={setInterventionType}
              disabled={isPremiumFeature}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select intervention type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="increase-marketing">Increase Marketing Budget</SelectItem>
                <SelectItem value="reduce-support">Reduce Support Tickets</SelectItem>
                <SelectItem value="expand-sales">Expand Sales Team</SelectItem>
                <SelectItem value="market-shock">Market Shock Scenario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Variable to Modify
            </label>
            <Select
              value={selectedVariable}
              onValueChange={setSelectedVariable}
              disabled={isPremiumFeature}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variable..." />
              </SelectTrigger>
              <SelectContent>
                {(project.variables || []).filter(v => v.type === 'input').map((variable) => (
                  <SelectItem key={variable.id} value={variable.id}>
                    {variable.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Change Amount
            </label>
            <div className="flex items-center space-x-3">
              <Slider
                value={changeAmount}
                onValueChange={setChangeAmount}
                min={-50}
                max={50}
                step={1}
                className="flex-1"
                disabled={isPremiumFeature}
              />
              <span className="text-sm font-medium text-foreground w-16">
                {changeAmount[0] > 0 ? '+' : ''}{changeAmount[0]}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Simulation Period
            </label>
            <Select
              value={simulationPeriod}
              onValueChange={setSimulationPeriod}
              disabled={isPremiumFeature}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Next 30 days</SelectItem>
                <SelectItem value="90">Next 90 days</SelectItem>
                <SelectItem value="180">Next 6 months</SelectItem>
                <SelectItem value="365">Next 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            disabled={isPremiumFeature}
          >
            <Lock className="h-4 w-4 mr-2" />
            Run Simulation (Premium)
          </Button>
        </div>

        <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Unlock Advanced Simulations
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            Get intervention scenarios, shock testing, and detailed impact analysis.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 mb-4">
            <li>• Multiple scenario comparison</li>
            <li>• Intervention impact analysis</li>
            <li>• Market shock simulations</li>
            <li>• What-if scenario planning</li>
            <li>• Sensitivity analysis reports</li>
          </ul>
          <Button size="sm" variant="outline" className="text-primary border-primary">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade to Premium →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
