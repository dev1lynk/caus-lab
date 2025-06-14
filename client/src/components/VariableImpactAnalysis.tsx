import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Variable {
  name: string;
  displayName: string;
  impact: number;
  category: 'operational' | 'market' | 'financial' | 'external' | 'technical';
  description: string;
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  importance: 'high' | 'medium' | 'low';
}

const stVariables: Variable[] = [
  {
    name: 'operational_efficiency',
    displayName: 'Operational Efficiency',
    impact: 85.2,
    category: 'operational',
    description: 'Manufacturing efficiency and production optimization metrics',
    currentValue: 0.92,
    trend: 'up',
    importance: 'high'
  },
  {
    name: 'revenue_growth',
    displayName: 'Revenue Growth',
    impact: 78.4,
    category: 'financial',
    description: 'Quarterly revenue growth rate and projections',
    currentValue: 0.15,
    trend: 'up',
    importance: 'high'
  },
  {
    name: 'automotive_demand',
    displayName: 'Automotive Demand',
    impact: 72.1,
    category: 'market',
    description: 'Global automotive industry demand for sensors and controls',
    currentValue: 0.89,
    trend: 'stable',
    importance: 'high'
  },
  {
    name: 'semiconductor_supply',
    displayName: 'Semiconductor Supply',
    impact: 68.3,
    category: 'external',
    description: 'Global semiconductor supply chain stability',
    currentValue: 0.76,
    trend: 'down',
    importance: 'high'
  },
  {
    name: 'market_share',
    displayName: 'Market Share',
    impact: 65.7,
    category: 'market',
    description: 'ST market share in automotive sensor market',
    currentValue: 0.18,
    trend: 'up',
    importance: 'medium'
  },
  {
    name: 'oil_prices',
    displayName: 'Oil Prices',
    impact: 58.9,
    category: 'external',
    description: 'Crude oil price impact on automotive and industrial demand',
    currentValue: 75.2,
    trend: 'down',
    importance: 'medium'
  },
  {
    name: 'interest_rates',
    displayName: 'Interest Rates',
    impact: 54.6,
    category: 'external',
    description: 'Federal Reserve interest rates affecting capital and investment',
    currentValue: 5.25,
    trend: 'stable',
    importance: 'medium'
  },
  {
    name: 'technology_innovation',
    displayName: 'Technology Innovation',
    impact: 51.3,
    category: 'technical',
    description: 'R&D investment and new product development pipeline',
    currentValue: 0.84,
    trend: 'up',
    importance: 'medium'
  },
  {
    name: 'nasdaq_performance',
    displayName: 'NASDAQ Performance',
    impact: 47.8,
    category: 'market',
    description: 'Technology sector performance and investor sentiment',
    currentValue: 14250,
    trend: 'up',
    importance: 'medium'
  },
  {
    name: 'supply_chain_stability',
    displayName: 'Supply Chain Stability',
    impact: 44.2,
    category: 'operational',
    description: 'Global supply chain reliability and logistics performance',
    currentValue: 0.81,
    trend: 'stable',
    importance: 'medium'
  },
  {
    name: 'manufacturing_costs',
    displayName: 'Manufacturing Costs',
    impact: 41.7,
    category: 'operational',
    description: 'Production costs including materials, labor, and energy',
    currentValue: 0.88,
    trend: 'down',
    importance: 'low'
  },
  {
    name: 'currency_rates',
    displayName: 'Currency Exchange Rates',
    impact: 38.4,
    category: 'external',
    description: 'EUR/USD exchange rates affecting international revenue',
    currentValue: 1.08,
    trend: 'stable',
    importance: 'low'
  },
  {
    name: 'regulatory_environment',
    displayName: 'Regulatory Environment',
    impact: 35.1,
    category: 'external',
    description: 'Automotive safety regulations and compliance requirements',
    currentValue: 0.93,
    trend: 'stable',
    importance: 'low'
  },
  {
    name: 'customer_satisfaction',
    displayName: 'Customer Satisfaction',
    impact: 28.9,
    category: 'market',
    description: 'Customer retention and satisfaction scores',
    currentValue: 0.91,
    trend: 'up',
    importance: 'low'
  },
  {
    name: 'market_volatility',
    displayName: 'Market Volatility',
    impact: 22.3,
    category: 'market',
    description: 'Stock market volatility and investor confidence',
    currentValue: 0.36,
    trend: 'down',
    importance: 'low'
  }
];

const categoryColors = {
  operational: 'bg-blue-500',
  market: 'bg-green-500',
  financial: 'bg-purple-500',
  external: 'bg-orange-500',
  technical: 'bg-cyan-500'
};

const categoryLabels = {
  operational: 'Operational',
  market: 'Market',
  financial: 'Financial',
  external: 'External',
  technical: 'Technical'
};

export default function VariableImpactAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'impact' | 'category' | 'importance'>('impact');

  const filteredVariables = selectedCategory 
    ? stVariables.filter(v => v.category === selectedCategory)
    : stVariables;

  const sortedVariables = [...filteredVariables].sort((a, b) => {
    if (sortBy === 'impact') return b.impact - a.impact;
    if (sortBy === 'category') return a.category.localeCompare(b.category);
    if (sortBy === 'importance') {
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.importance] - order[a.importance];
    }
    return 0;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 70) return 'text-red-600 dark:text-red-400';
    if (impact >= 50) return 'text-orange-600 dark:text-orange-400';
    if (impact >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const categories = Array.from(new Set(stVariables.map(v => v.category)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              Variable Impact Analysis
            </div>
            <Badge variant="outline">15 Variables</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                !selectedCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${categoryColors[category as keyof typeof categoryColors]}`} />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 mb-6">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 rounded-md border bg-background text-sm"
            >
              <option value="impact">Sort by Impact</option>
              <option value="category">Sort by Category</option>
              <option value="importance">Sort by Importance</option>
            </select>
          </div>

          {/* Variables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedVariables.map((variable) => (
              <TooltipProvider key={variable.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className="hover:shadow-md transition-shadow cursor-help">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight">
                                {variable.displayName}
                              </h4>
                              <div className="flex items-center mt-1">
                                <div className={`w-2 h-2 rounded-full mr-2 ${categoryColors[variable.category]}`} />
                                <span className="text-xs text-muted-foreground">
                                  {categoryLabels[variable.category]}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {getTrendIcon(variable.trend)}
                              <Badge 
                                variant={
                                  variable.importance === 'high' ? 'default' :
                                  variable.importance === 'medium' ? 'secondary' : 'outline'
                                }
                                className="text-xs"
                              >
                                {variable.importance}
                              </Badge>
                            </div>
                          </div>

                          {/* Impact Score */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Impact Score</span>
                              <span className={`text-sm font-bold ${getImpactColor(variable.impact)}`}>
                                {variable.impact.toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={variable.impact} 
                              className="h-2"
                            />
                          </div>

                          {/* Current Value */}
                          <div className="text-xs">
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-medium">
                              {variable.name.includes('rate') || variable.name.includes('price') 
                                ? variable.currentValue.toFixed(2)
                                : variable.name.includes('nasdaq')
                                ? variable.currentValue.toLocaleString()
                                : (variable.currentValue * 100).toFixed(1) + '%'
                              }
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">{variable.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {stVariables.filter(v => v.impact >= 70).length}
                </p>
                <p className="text-xs text-muted-foreground">High Impact</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stVariables.filter(v => v.impact >= 50 && v.impact < 70).length}
                </p>
                <p className="text-xs text-muted-foreground">Medium Impact</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stVariables.filter(v => v.trend === 'up').length}
                </p>
                <p className="text-xs text-muted-foreground">Trending Up</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {(stVariables.reduce((sum, v) => sum + v.impact, 0) / stVariables.length).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Impact</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}