import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, DollarSign, BarChart3, Target, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import type { Project } from "@shared/schema";

interface StockPredictionDashboardProps {
  project: Project;
}

interface PredictionData {
  historicalPrices: { date: string; price: number; }[];
  predictedPrices: { date: string; price: number; confidence: { upper: number; lower: number; }; }[];
  variableImportance: { variable: string; importance: number; impact: string; }[];
  executiveSummary: {
    currentPrice: number;
    predictedPrice: number;
    priceChange: number;
    confidence: number;
    outlook: string;
    keyDrivers: string[];
    risks: string[];
    opportunities: string[];
  };
}

export default function StockPredictionDashboard({ project }: StockPredictionDashboardProps) {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState("30");
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; price: number; date: string; type: 'historical' | 'predicted' } | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{ price: number; date: string; type: 'historical' | 'predicted' } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const generatePrediction = async () => {
    setIsGenerating(true);
    
    // Simulate prediction generation with realistic semiconductor stock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const currentPrice = 42.15;
    const baseGrowth = 0.12; // 12% expected growth
    const volatility = 0.25; // 25% volatility
    
    // Generate historical data (last 30 days)
    const historicalPrices = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));
      const randomWalk = (Math.random() - 0.5) * 0.03;
      const price = currentPrice + (i - 15) * 0.1 + randomWalk * currentPrice;
      return {
        date: date.toISOString().split('T')[0],
        price: Math.max(price, 35)
      };
    });
    
    // Generate future predictions
    const daysToPredict = parseInt(timeHorizon);
    const predictedPrices = Array.from({ length: daysToPredict }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      
      const growth = baseGrowth * (i + 1) / 365;
      const uncertainty = volatility * Math.sqrt((i + 1) / 365);
      const predicted = currentPrice * (1 + growth);
      
      return {
        date: date.toISOString().split('T')[0],
        price: predicted,
        confidence: {
          upper: predicted * (1 + uncertainty),
          lower: predicted * (1 - uncertainty)
        }
      };
    });
    
    const finalPrediction = predictedPrices[predictedPrices.length - 1];
    const priceChange = ((finalPrediction.price - currentPrice) / currentPrice) * 100;
    
    const mockData: PredictionData = {
      historicalPrices,
      predictedPrices,
      variableImportance: [
        { variable: "ST EPS", importance: 92, impact: "Strong Positive" },
        { variable: "NASDAQ/SOXX", importance: 88, impact: "Positive" },
        { variable: "ST Orders Shipment", importance: 85, impact: "Positive" },
        { variable: "Global Chip Demand Index", importance: 78, impact: "Positive" },
        { variable: "ST Revenues", importance: 75, impact: "Strong Positive" },
        { variable: "ASML Stock Price", importance: 68, impact: "Positive" },
        { variable: "Interest Rate", importance: 65, impact: "Negative" },
        { variable: "ST Forward P/E", importance: 58, impact: "Moderate" },
        { variable: "TI Stock Price", importance: 52, impact: "Positive" },
        { variable: "Crude Oil Price", importance: 45, impact: "Negative" },
        { variable: "ST Forecast", importance: 42, impact: "Positive" },
        { variable: "Infineon Stock Price", importance: 38, impact: "Positive" },
        { variable: "ST Inventory", importance: 35, impact: "Moderate" },
        { variable: "ST Export Data", importance: 32, impact: "Positive" },
        { variable: "Infineon Shipments", importance: 28, impact: "Weak Positive" }
      ],
      executiveSummary: {
        currentPrice: currentPrice,
        predictedPrice: finalPrediction.price,
        priceChange,
        confidence: 87.3,
        outlook: priceChange > 0 ? "Bullish" : "Bearish",
        keyDrivers: [
          "Strong earnings growth driven by automotive semiconductor demand",
          "Positive semiconductor sector momentum (SOXX index performance)",
          "Robust order-to-shipment ratio indicating healthy demand pipeline",
          "Favorable positioning in AI and IoT chip markets"
        ],
        risks: [
          "Interest rate volatility affecting tech valuations",
          "Global supply chain disruptions from geopolitical tensions",
          "Inventory buildup potentially signaling demand softening",
          "Oil price fluctuations impacting manufacturing costs"
        ],
        opportunities: [
          "Expansion in electric vehicle semiconductor market",
          "5G infrastructure rollout driving chip demand",
          "Strategic partnerships with leading equipment suppliers (ASML)",
          "Market share gains in power management ICs"
        ]
      }
    };
    
    setPredictionData(mockData);
    setIsGenerating(false);
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!predictionData || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert screen coordinates to SVG coordinates
    const svgX = (x / rect.width) * 800;
    const svgY = (y / rect.height) * 400;
    
    // Check if we're in the chart area
    if (svgX >= 80 && svgX <= 760 && svgY >= 20 && svgY <= 360) {
      const chartX = svgX - 80;
      const chartY = svgY - 20;
      
      // Find the closest data point
      let closestPoint = null;
      let minDistance = Infinity;
      
      // Check historical points
      predictionData.historicalPrices.forEach((point, i) => {
        const pointX = (i / (predictionData.historicalPrices.length - 1)) * 340;
        const pointY = 340 - ((point.price - 35) / 20) * 340;
        const distance = Math.sqrt(Math.pow(chartX - pointX, 2) + Math.pow(chartY - pointY, 2));
        
        if (distance < minDistance && distance < 20) {
          minDistance = distance;
          closestPoint = {
            x: svgX,
            y: svgY,
            price: point.price,
            date: point.date,
            type: 'historical' as const
          };
        }
      });
      
      // Check predicted points
      predictionData.predictedPrices.forEach((point, i) => {
        const pointX = 340 + (i / (predictionData.predictedPrices.length - 1)) * 340;
        const pointY = 340 - ((point.price - 35) / 20) * 340;
        const distance = Math.sqrt(Math.pow(chartX - pointX, 2) + Math.pow(chartY - pointY, 2));
        
        if (distance < minDistance && distance < 20) {
          minDistance = distance;
          closestPoint = {
            x: svgX,
            y: svgY,
            price: point.price,
            date: point.date,
            type: 'predicted' as const
          };
        }
      });
      
      setHoveredPoint(closestPoint);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (hoveredPoint) {
      setSelectedPoint({
        price: hoveredPoint.price,
        date: hoveredPoint.date,
        type: hoveredPoint.type
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Stock Price Prediction Dashboard
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className="text-xs px-2 py-1 border rounded"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="180">6 Months</option>
              </select>
              <Button 
                onClick={generatePrediction}
                disabled={isGenerating}
                size="sm"
              >
                {isGenerating ? "Generating..." : "Generate Prediction"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!predictionData ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Generate Stock Price Prediction
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use 16 key variables to predict STMicroelectronics stock price movement
              </p>
              <Button onClick={generatePrediction} disabled={isGenerating}>
                {isGenerating ? "Analyzing Variables..." : "Start Prediction Analysis"}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Executive Summary</TabsTrigger>
                <TabsTrigger value="chart">Price Chart</TabsTrigger>
                <TabsTrigger value="variables">Variable Impact</TabsTrigger>
                <TabsTrigger value="insights">Market Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                          <p className="text-2xl font-bold">{formatPrice(predictionData.executiveSummary.currentPrice)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Predicted Price</p>
                          <p className="text-2xl font-bold">{formatPrice(predictionData.executiveSummary.predictedPrice)}</p>
                        </div>
                        <Target className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Expected Change</p>
                          <p className={`text-2xl font-bold ${predictionData.executiveSummary.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercentage(predictionData.executiveSummary.priceChange)}
                          </p>
                        </div>
                        {predictionData.executiveSummary.priceChange >= 0 ? 
                          <ArrowUp className="h-8 w-8 text-green-500" /> : 
                          <ArrowDown className="h-8 w-8 text-red-500" />
                        }
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                          <p className="text-2xl font-bold">{predictionData.executiveSummary.confidence}%</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Key Growth Drivers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {predictionData.executiveSummary.keyDrivers.map((driver, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{driver}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Risk Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {predictionData.executiveSummary.risks.map((risk, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Market Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {predictionData.executiveSummary.opportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interactive Price Prediction Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 relative bg-white dark:bg-gray-900 rounded-lg border">
                      <svg
                        ref={svgRef}
                        className="w-full h-full cursor-crosshair"
                        viewBox="0 0 800 400"
                        preserveAspectRatio="xMidYMid meet"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onClick={handleClick}
                      >
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Chart area */}
                        <g transform="translate(80, 20)">
                          {/* Y-axis */}
                          <line x1="0" y1="0" x2="0" y2="340" stroke="#374151" strokeWidth="2" />
                          {/* X-axis */}
                          <line x1="0" y1="340" x2="680" y2="340" stroke="#374151" strokeWidth="2" />
                          
                          {/* Y-axis labels */}
                          {[35, 40, 45, 50, 55].map((price, i) => (
                            <g key={price}>
                              <line x1="-5" y1={340 - (i * 68)} x2="0" y2={340 - (i * 68)} stroke="#374151" strokeWidth="1" />
                              <text x="-10" y={340 - (i * 68) + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                                ${price}
                              </text>
                            </g>
                          ))}
                          
                          {/* Historical data line */}
                          <path
                            d={predictionData.historicalPrices.map((point, i) => {
                              const x = (i / (predictionData.historicalPrices.length - 1)) * 340;
                              const y = 340 - ((point.price - 35) / 20) * 340;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                          
                          {/* Predicted data line */}
                          <path
                            d={predictionData.predictedPrices.map((point, i) => {
                              const x = 340 + (i / (predictionData.predictedPrices.length - 1)) * 340;
                              const y = 340 - ((point.price - 35) / 20) * 340;
                              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeDasharray="5,5"
                          />
                          
                          {/* Confidence interval */}
                          <path
                            d={`M ${340} ${340 - ((predictionData.predictedPrices[0].confidence.lower - 35) / 20) * 340} 
                                ${predictionData.predictedPrices.map((point, i) => {
                                  const x = 340 + (i / (predictionData.predictedPrices.length - 1)) * 340;
                                  const y = 340 - ((point.confidence.lower - 35) / 20) * 340;
                                  return `L ${x} ${y}`;
                                }).join(' ')}
                                ${predictionData.predictedPrices.slice().reverse().map((point, i) => {
                                  const x = 340 + ((predictionData.predictedPrices.length - 1 - i) / (predictionData.predictedPrices.length - 1)) * 340;
                                  const y = 340 - ((point.confidence.upper - 35) / 20) * 340;
                                  return `L ${x} ${y}`;
                                }).join(' ')} Z`}
                            fill="rgba(16, 185, 129, 0.1)"
                            stroke="none"
                          />
                          
                          {/* Data points */}
                          {predictionData.historicalPrices.slice(-5).map((point, i) => {
                            const x = ((predictionData.historicalPrices.length - 5 + i) / (predictionData.historicalPrices.length - 1)) * 340;
                            const y = 340 - ((point.price - 35) / 20) * 340;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#3b82f6"
                                stroke="white"
                                strokeWidth="2"
                              />
                            );
                          })}
                          
                          {predictionData.predictedPrices.slice(0, 5).map((point, i) => {
                            const x = 340 + (i / (predictionData.predictedPrices.length - 1)) * 340;
                            const y = 340 - ((point.price - 35) / 20) * 340;
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#10b981"
                                stroke="white"
                                strokeWidth="2"
                              />
                            );
                          })}
                          
                          {/* Divider line */}
                          <line x1="340" y1="0" x2="340" y2="340" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                          
                          {/* Legend */}
                          <g transform="translate(400, 30)">
                            <rect x="0" y="0" width="200" height="80" fill="rgba(255,255,255,0.9)" stroke="#e5e7eb" rx="4" />
                            <line x1="10" y1="20" x2="30" y2="20" stroke="#3b82f6" strokeWidth="3" />
                            <text x="35" y="25" fontSize="12" fill="#374151">Historical Prices</text>
                            <line x1="10" y1="40" x2="30" y2="40" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" />
                            <text x="35" y="45" fontSize="12" fill="#374151">Predicted Prices</text>
                            <rect x="10" y="55" width="20" height="8" fill="rgba(16, 185, 129, 0.2)" />
                            <text x="35" y="63" fontSize="12" fill="#374151">Confidence Band</text>
                          </g>
                          
                          {/* Current price indicator */}
                          <g transform="translate(340, 0)">
                            <text x="5" y="15" fontSize="12" fill="#ef4444" fontWeight="bold">Current: ${predictionData.executiveSummary.currentPrice.toFixed(2)}</text>
                          </g>
                        </g>
                        
                        {/* X-axis labels */}
                        <g transform="translate(80, 370)">
                          <text x="85" y="15" textAnchor="middle" fontSize="12" fill="#6b7280">-30d</text>
                          <text x="170" y="15" textAnchor="middle" fontSize="12" fill="#6b7280">-15d</text>
                          <text x="340" y="15" textAnchor="middle" fontSize="12" fill="#ef4444" fontWeight="bold">Today</text>
                          <text x="510" y="15" textAnchor="middle" fontSize="12" fill="#6b7280">+15d</text>
                          <text x="680" y="15" textAnchor="middle" fontSize="12" fill="#6b7280">+{timeHorizon}d</text>
                        </g>
                        
                        {/* Hover tooltip */}
                        {hoveredPoint && (
                          <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y})`}>
                            <rect
                              x="-50"
                              y="-35"
                              width="100"
                              height="30"
                              fill="rgba(0,0,0,0.8)"
                              stroke="white"
                              strokeWidth="1"
                              rx="4"
                            />
                            <text x="0" y="-20" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                              {formatPrice(hoveredPoint.price)}
                            </text>
                            <text x="0" y="-10" textAnchor="middle" fontSize="8" fill="#ccc">
                              {new Date(hoveredPoint.date).toLocaleDateString()}
                            </text>
                            <circle cx="0" cy="0" r="6" fill={hoveredPoint.type === 'historical' ? '#3b82f6' : '#10b981'} stroke="white" strokeWidth="2" />
                          </g>
                        )}
                        
                        {/* Selected point indicator */}
                        {selectedPoint && (
                          <g transform="translate(80, 380)">
                            <rect x="0" y="0" width="300" height="25" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" rx="4" />
                            <text x="10" y="16" fontSize="12" fill="#3b82f6" fontWeight="bold">
                              Selected: {formatPrice(selectedPoint.price)} on {new Date(selectedPoint.date).toLocaleDateString()} ({selectedPoint.type})
                            </text>
                          </g>
                        )}
                      </svg>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <div className="font-medium text-foreground">Price Range</div>
                        <div className="text-muted-foreground">
                          {formatPrice(Math.min(...predictionData.predictedPrices.map(p => p.confidence.lower)))} - 
                          {formatPrice(Math.max(...predictionData.predictedPrices.map(p => p.confidence.upper)))}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                        <div className="font-medium text-foreground">Volatility</div>
                        <div className="text-muted-foreground">±25%</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="font-medium text-foreground">Trend</div>
                        <div className="text-muted-foreground">{predictionData.executiveSummary.outlook}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                        <div className="font-medium text-foreground">Timeline</div>
                        <div className="text-muted-foreground">{timeHorizon} days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variables" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Variable Importance Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {predictionData.variableImportance.slice(0, 8).map((variable, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center flex-1">
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{variable.variable}</div>
                              <div className="text-xs text-muted-foreground">{variable.impact}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${variable.importance}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium w-12 text-right">
                              {variable.importance}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Market Context</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Semiconductor Sector Outlook:</strong> The NASDAQ/SOXX index shows strong momentum with 
                          growing demand from AI, automotive, and IoT applications driving sustained growth.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded border border-green-200 dark:border-green-800">
                          <div className="text-sm font-medium text-green-900 dark:text-green-100">Positive Correlations</div>
                          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                            ST stock shows strong correlation with ASML (0.78) and TI (0.65), indicating sector-wide trends
                          </div>
                        </div>
                        
                        <div className="p-3 bg-orange-50 dark:bg-orange-950/50 rounded border border-orange-200 dark:border-orange-800">
                          <div className="text-sm font-medium text-orange-900 dark:text-orange-100">Macro Sensitivity</div>
                          <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                            Interest rate changes impact P/E multiples with -0.45 correlation to forward P/E ratio
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Trading Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded border border-blue-200 dark:border-blue-800">
                          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Entry Point</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">$41.50 - $42.50</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300">Support level range</div>
                        </div>
                        
                        <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded border border-green-200 dark:border-green-800">
                          <div className="text-sm font-medium text-green-900 dark:text-green-100">Target Price</div>
                          <div className="text-lg font-bold text-green-900 dark:text-green-100">
                            {formatPrice(predictionData.executiveSummary.predictedPrice)}
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300">{timeHorizon}-day target</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Key Catalysts to Watch:</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>• Q4 earnings announcement (EPS impact: 92%)</div>
                          <div>• Automotive chip order updates (shipment volume)</div>
                          <div>• Fed interest rate decisions (P/E multiple impact)</div>
                          <div>• ASML equipment delivery schedules</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}