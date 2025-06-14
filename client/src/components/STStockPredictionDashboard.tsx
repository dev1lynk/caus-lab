import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Target, AlertCircle, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  volume: number;
  timestamp: number;
}

interface MarketInsights {
  priceChange: number;
  priceChangePercent: number;
  volatility: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  technicalIndicators: {
    rsi?: number;
    ma50?: number;
    ma200?: number;
    support?: number;
    resistance?: number;
  };
  summary: string;
  marketSentiment: string;
}

interface PredictionResponse {
  timeframe: string;
  currentPrice: number;
  predictions: Array<{
    date: string;
    price: number;
    confidence: { upper: number; lower: number; };
  }>;
  historicalData: Array<{
    date: string;
    close: number;
  }>;
  insights: MarketInsights;
  executiveSummary: {
    outlook: string;
    keyDrivers: string[];
    marketSentiment: string;
    recommendation: string;
  };
}

export default function STStockPredictionDashboard() {
  const [currentPrice, setCurrentPrice] = useState<StockPrice | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("30d");
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const timeframes = [
    { value: "1d", label: "1 Day" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "6m", label: "6 Months" }
  ];

  useEffect(() => {
    loadCurrentPrice();
    const interval = setInterval(loadCurrentPrice, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadCurrentPrice = async () => {
    try {
      const response = await fetch('/api/stock/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentPrice(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to load current price:', error);
    }
  };

  const generatePrediction = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stock/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timeframe: selectedTimeframe,
          variables: generateVariableInputs()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate prediction');
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (error) {
      setError('Failed to generate stock prediction. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVariableInputs = () => {
    // Generate realistic variable inputs for ST stock prediction
    return {
      operational_efficiency: Math.random() * 0.2 + 0.8, // 0.8-1.0
      revenue_growth: Math.random() * 0.3 + 0.85, // 0.85-1.15
      market_share: Math.random() * 0.1 + 0.9, // 0.9-1.0
      automotive_demand: Math.random() * 0.4 + 0.8, // 0.8-1.2
      semiconductor_supply: Math.random() * 0.3 + 0.85, // 0.85-1.15
      oil_prices: Math.random() * 0.6 + 0.7, // 0.7-1.3
      interest_rates: Math.random() * 0.4 + 0.8, // 0.8-1.2
      nasdaq_performance: Math.random() * 0.3 + 0.85, // 0.85-1.15
      currency_rates: Math.random() * 0.2 + 0.9, // 0.9-1.1
      manufacturing_costs: Math.random() * 0.3 + 0.85, // 0.85-1.15
      technology_innovation: Math.random() * 0.2 + 0.9, // 0.9-1.1
      regulatory_environment: Math.random() * 0.2 + 0.9, // 0.9-1.1
      supply_chain_stability: Math.random() * 0.3 + 0.85, // 0.85-1.15
      customer_satisfaction: Math.random() * 0.15 + 0.925, // 0.925-1.075
      market_volatility: Math.random() * 0.4 + 0.8 // 0.8-1.2
    };
  };

  const formatChartData = () => {
    if (!predictionData) return [];

    const historicalPoints = predictionData.historicalData.map(item => ({
      date: item.date,
      actualPrice: item.close,
      predictedPrice: null,
      upperBound: null,
      lowerBound: null
    }));

    const predictionPoints = predictionData.predictions.map(item => ({
      date: item.date,
      actualPrice: null,
      predictedPrice: item.price,
      upperBound: item.confidence.upper,
      lowerBound: item.confidence.lower
    }));

    return [...historicalPoints, ...predictionPoints];
  };

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <DollarSign className="h-4 w-4 text-gray-500" />;
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header with Real-time Price */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              STM (STMicroelectronics) Stock Prediction
            </div>
            <Badge variant="default" className="bg-blue-500">Real-time Data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                    {currentPrice ? (
                      <p className="text-2xl font-bold">${currentPrice.price.toFixed(2)}</p>
                    ) : (
                      <Skeleton className="h-8 w-20" />
                    )}
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Daily Change</p>
                    {currentPrice ? (
                      <div className="flex items-center">
                        <p className={`text-lg font-bold ${getPriceChangeColor(currentPrice.change)}`}>
                          ${currentPrice.change.toFixed(2)}
                        </p>
                        {getPriceChangeIcon(currentPrice.change)}
                      </div>
                    ) : (
                      <Skeleton className="h-6 w-16" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Percentage Change</p>
                    {currentPrice ? (
                      <p className={`text-lg font-bold ${getPriceChangeColor(currentPrice.changePercent)}`}>
                        {currentPrice.changePercent > 0 ? '+' : ''}{currentPrice.changePercent.toFixed(2)}%
                      </p>
                    ) : (
                      <Skeleton className="h-6 w-16" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Volume</p>
                    {currentPrice ? (
                      <p className="text-lg font-bold">{(currentPrice.volume / 1000000).toFixed(1)}M</p>
                    ) : (
                      <Skeleton className="h-6 w-16" />
                    )}
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-4 flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Prediction Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium mb-2 block">Prediction Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {tf.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generatePrediction}
              disabled={isLoading || !currentPrice}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Prediction
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {predictionData && (
        <>
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Market Outlook</h4>
                    <Badge 
                      variant={
                        predictionData.executiveSummary.outlook === 'Positive' ? 'default' : 
                        predictionData.executiveSummary.outlook === 'Negative' ? 'destructive' : 
                        'secondary'
                      }
                      className={
                        predictionData.executiveSummary.outlook === 'Positive' ? 'bg-green-500' : ''
                      }
                    >
                      {predictionData.executiveSummary.outlook}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Drivers</h4>
                    <ul className="text-sm space-y-1">
                      {predictionData.executiveSummary.keyDrivers.map((driver, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Market Sentiment</h4>
                    <p className="text-sm text-muted-foreground">
                      {predictionData.executiveSummary.marketSentiment}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Recommendation</h4>
                    <p className="text-sm font-medium">
                      {predictionData.executiveSummary.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Price Prediction Chart ({selectedTimeframe})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        value ? `$${Number(value).toFixed(2)}` : 'N/A', 
                        name
                      ]}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    
                    <Line 
                      type="monotone" 
                      dataKey="actualPrice" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                      name="Actual Price (Historical)"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="predictedPrice" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      name="Predicted Price"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="upperBound" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Upper Confidence"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="lowerBound" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Lower Confidence"
                      connectNulls={false}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Insights & Technical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Volatility</p>
                      <p className="text-2xl font-bold">{predictionData.insights.volatility.toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">RSI</p>
                      <p className="text-2xl font-bold">
                        {predictionData.insights.technicalIndicators.rsi?.toFixed(0) || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Trend</p>
                      <Badge 
                        variant={
                          predictionData.insights.trend === 'bullish' ? 'default' : 
                          predictionData.insights.trend === 'bearish' ? 'destructive' : 
                          'secondary'
                        }
                        className={
                          predictionData.insights.trend === 'bullish' ? 'bg-green-500' : ''
                        }
                      >
                        {predictionData.insights.trend.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Analysis Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {predictionData.insights.summary}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}