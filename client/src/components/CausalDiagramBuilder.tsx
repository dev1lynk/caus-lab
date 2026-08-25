import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Undo, Redo, Sparkles, MousePointer } from "lucide-react";
import type { Project, Variable, CausalLink } from "@shared/schema";

interface CausalDiagramBuilderProps {
  project: Project;
}

export default function CausalDiagramBuilder({ project }: CausalDiagramBuilderProps) {
  const [causalLinks, setCausalLinks] = useState<CausalLink[]>(project.causalLinks || []);
  const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateLinksMutation = useMutation({
    mutationFn: async (links: CausalLink[]) => {
      const response = await fetch(`/api/projects/${project.id}/causal-links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update causal links');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${project.id}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update causal links",
        variant: "destructive",
      });
    },
  });

  const handleVariableClick = useCallback((variableId: string) => {
    if (connectingFrom === null) {
      setConnectingFrom(variableId);
      setSelectedVariable(variableId);
    } else if (connectingFrom !== variableId) {
      // Create new causal link
      const newLink: CausalLink = {
        id: `link-${Date.now()}`,
        source: connectingFrom,
        target: variableId,
        strength: 50,
      };
      
      const updatedLinks = [...causalLinks, newLink];
      setCausalLinks(updatedLinks);
      updateLinksMutation.mutate(updatedLinks);
      
      setConnectingFrom(null);
      setSelectedVariable(null);
    } else {
      setConnectingFrom(null);
      setSelectedVariable(null);
    }
  }, [connectingFrom, causalLinks, updateLinksMutation]);

  const handleStrengthChange = useCallback((linkId: string, strength: number) => {
    const updatedLinks = causalLinks.map(link =>
      link.id === linkId ? { ...link, strength } : link
    );
    setCausalLinks(updatedLinks);
    updateLinksMutation.mutate(updatedLinks);
  }, [causalLinks, updateLinksMutation]);

  const autoDetectRelations = () => {
    toast({
      title: "Auto-detection started",
      description: "Analyzing data to suggest causal relationships...",
    });
    
    // Mock auto-detection with some default relationships
    setTimeout(() => {
      const variables = project.variables || [];
      if (variables.length >= 2) {
        const newLinks: CausalLink[] = [];
        
        // Create some sample relationships
        for (let i = 1; i < variables.length; i++) {
          if (variables[0] && variables[i]) {
            newLinks.push({
              id: `auto-link-${i}`,
              source: variables[i].id,
              target: variables[0].id, // First variable as target
              strength: Math.floor(Math.random() * 60) + 40, // 40-100%
            });
          }
        }
        
        setCausalLinks(newLinks);
        updateLinksMutation.mutate(newLinks);
        
        toast({
          title: "Auto-detection complete",
          description: `Found ${newLinks.length} potential causal relationships.`,
        });
      }
    }, 1500);
  };

  const variables = project.variables || [];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Causal Diagram Builder</h3>
            <p className="text-sm text-muted-foreground">
              Define relationships between variables by connecting them
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" disabled>
              <Redo className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={autoDetectRelations}>
              <Sparkles className="h-4 w-4 mr-2" />
              Auto-Detect Relations
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Interactive diagram area */}
        <div className="relative bg-muted/30 rounded-lg h-96 border-2 border-dashed border-border overflow-hidden">
          {/* Variable nodes */}
          <div className="absolute inset-4">
            {variables.map((variable, index) => {
              const position = variable.position || {
                x: 100 + (index * 120),
                y: 100 + (index % 2) * 100
              };
              
              const isSelected = selectedVariable === variable.id;
              const isConnecting = connectingFrom === variable.id;
              
              return (
                <div
                  key={variable.id}
                  className={`absolute variable-node px-4 py-2 rounded-full shadow-lg cursor-pointer ${
                    isSelected ? 'selected' : ''
                  } ${isConnecting ? 'ring-2 ring-accent' : ''}`}
                  style={{
                    left: position.x,
                    top: position.y,
                    backgroundColor: variable.color,
                    color: 'white',
                  }}
                  onClick={() => handleVariableClick(variable.id)}
                >
                  <span className="text-sm font-medium">{variable.name}</span>
                </div>
              );
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
              {causalLinks.map((link) => {
                const sourceVar = variables.find(v => v.id === link.source);
                const targetVar = variables.find(v => v.id === link.target);
                
                if (!sourceVar || !targetVar) return null;
                
                const sourcePos = sourceVar.position || { x: 150, y: 150 };
                const targetPos = targetVar.position || { x: 250, y: 150 };
                
                const strengthClass = 
                  link.strength > 70 ? 'strong' : 
                  link.strength > 40 ? 'medium' : 'weak';
                
                return (
                  <line
                    key={link.id}
                    x1={sourcePos.x + 50}
                    y1={sourcePos.y + 20}
                    x2={targetPos.x + 50}
                    y2={targetPos.y + 20}
                    className={`connection-line ${strengthClass}`}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>
          </div>

          {/* Instructions overlay */}
          <div className="absolute bottom-4 left-4 bg-card/90 rounded-lg p-3 shadow-sm">
            <p className="text-xs text-muted-foreground flex items-center">
              <MousePointer className="h-4 w-4 text-primary mr-1" />
              {connectingFrom 
                ? "Click another variable to create a causal link"
                : "Click variables to select them, then click another to create causal links"
              }
            </p>
          </div>
        </div>

        {/* Connection strength controls */}
        {causalLinks.length > 0 && (
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-foreground">Causal Link Strengths</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {causalLinks.map((link) => {
                const sourceVar = variables.find(v => v.id === link.source);
                const targetVar = variables.find(v => v.id === link.target);
                
                if (!sourceVar || !targetVar) return null;
                
                return (
                  <div key={link.id} className="p-4 bg-muted rounded-lg">
                    <h6 className="text-sm font-medium text-foreground mb-2">
                      {sourceVar.name} → {targetVar.name}
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Weak</span>
                        <span>Strong</span>
                      </div>
                      <Slider
                        value={[link.strength]}
                        onValueChange={([value]) => handleStrengthChange(link.id, value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-xs text-foreground font-medium">
                        Strength: {link.strength}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
