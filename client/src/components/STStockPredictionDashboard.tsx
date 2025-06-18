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

interface TimeframeAnalysis {
  period: string;
  priceChange: number;
  priceChangePercent: number;
  volatility: number;
  avgVolume: number;
  high: number;
  low: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  momentum: string;
  keyEvents: string[];
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
    macd?: number;
    bollinger?: { upper: number; lower: number; middle: number };
    stochastic?: number;
  };
  summary: string;
  marketSentiment: string;
  multiTimeframe?: {
    '7d': TimeframeAnalysis;
    '30d': TimeframeAnalysis;
    '90d': TimeframeAnalysis;
    '6m': TimeframeAnalysis;
  };
  fundamentals?: {
    peRatio?: number;
    eps?: number;
    marketCap?: number;
    dividend?: number;
    beta?: number;
    dayRange: { low: number; high: number };
    weekRange52: { low: number; high: number };
    avgVolume?: number;
    sharesOutstanding?: number;
    bookValue?: number;
    priceToBook?: number;
  };
  liveMarketData?: {
    marketStatus: 'open' | 'closed' | 'pre-market' | 'after-hours';
    nextEarnings?: string;
    institutionalOwnership?: number;
    shortInterest?: number;
    analystRating?: { rating: string; targetPrice: number; analysts: number };
    sectorPerformance: {
      sector: string;
      performance: number;
      ranking: number;
    };
    correlations: {
      sp500: number;
      nasdaq: number;
      sector: number;
    };
  };
  newsAndSentiment?: {
    sentiment: 'very-positive' | 'positive' | 'neutral' | 'negative' | 'very-negative';
    sentimentScore: number;
    recentNews: Array<{
      headline: string;
      impact: 'high' | 'medium' | 'low';
      timestamp: string;
    }>;
    socialSentiment: {
      bullish: number;
      bearish: number;
      neutral: number;
    };
  };
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
  const [accuracyDataType, setAccuracyDataType] = useState<'original' | 'normalized'>('original');

  const timeframes = [
    { value: "1d", label: "1 Day" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "6m", label: "6 Months" }
  ];

  useEffect(() => {
    loadCurrentPrice();
    const priceInterval = setInterval(loadCurrentPrice, 60000); // Update every minute
    
    // Auto-generate predictions on initial load and refresh
    if (selectedTimeframe) {
      generatePrediction();
      const predictionInterval = setInterval(generatePrediction, 300000); // Update predictions every 5 minutes
      return () => {
        clearInterval(priceInterval);
        clearInterval(predictionInterval);
      };
    }
    
    return () => clearInterval(priceInterval);
  }, [selectedTimeframe]);

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

    // Historical data up to June 9th (T-NCM-VAE model limit)
    const historicalPoints = predictionData.historicalData
      .filter(item => new Date(item.date) <= new Date('2025-06-09'))
      .map(item => ({
        date: item.date,
        actualPrice: item.close,
        predictedPrice: null,
        upperBound: null,
        lowerBound: null
      }));

    // Get actual prices from June 10-14 for comparison
    const actualJune10to14 = predictionData.historicalData
      .filter(item => {
        const date = new Date(item.date);
        return date >= new Date('2025-06-10') && date <= new Date('2025-06-14');
      })
      .map(item => ({
        date: item.date,
        actualPrice: item.close,
        predictedPrice: null,
        upperBound: null,
        lowerBound: null
      }));

    // Get predictions for June 10-14 to match actual data
    const predictionsJune10to14 = predictionData.predictions
      .filter(item => {
        const date = new Date(item.date);
        return date >= new Date('2025-06-10') && date <= new Date('2025-06-14');
      })
      .map(item => ({
        date: item.date,
        actualPrice: null,
        predictedPrice: item.price,
        upperBound: item.confidence.upper,
        lowerBound: item.confidence.lower
      }));



    // Create a comprehensive date-based mapping for all prediction data
    const dataMap = new Map();
    const currentDate = new Date();
    
    // Add all actual historical data from June 10 onwards
    predictionData.historicalData
      .filter(item => new Date(item.date) >= new Date('2025-06-10'))
      .forEach(item => {
        dataMap.set(item.date, {
          date: item.date,
          actualPrice: item.close,
          predictedPrice: null,
          upperBound: null,
          lowerBound: null
        });
      });

    // Overlay all predictions on the same dates and add future predictions
    predictionData.predictions.forEach(prediction => {
      const predDate = prediction.date;
      const existing = dataMap.get(predDate);
      
      if (existing) {
        // Merge with existing actual data
        dataMap.set(predDate, {
          ...existing,
          predictedPrice: prediction.price,
          upperBound: prediction.confidence.upper,
          lowerBound: prediction.confidence.lower
        });
      } else {
        // Add pure prediction data for dates without actual data
        dataMap.set(predDate, {
          date: predDate,
          actualPrice: null,
          predictedPrice: prediction.price,
          upperBound: prediction.confidence.upper,
          lowerBound: prediction.confidence.lower
        });
      }
    });

    // Convert map to array and sort by date
    const dynamicData = Array.from(dataMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return [...historicalPoints, ...dynamicData];
  };

  const calculateAccuracy = () => {
    if (!predictionData) return null;

    const actualPrices = predictionData.historicalData
      .filter(item => new Date(item.date) >= new Date('2025-06-10') && new Date(item.date) <= new Date('2025-06-14'))
      .map(item => ({ date: item.date, price: item.close }));

    const predictedPrices = predictionData.predictions
      .filter(item => new Date(item.date) >= new Date('2025-06-10') && new Date(item.date) <= new Date('2025-06-14'))
      .map(item => ({ date: item.date, price: item.price }));

    if (actualPrices.length === 0 || predictedPrices.length === 0) return null;

    let sumSquaredErrors = 0;
    let sumSquaredErrorsNormalized = 0;
    let comparisonCount = 0;

    // Calculate normalization parameters for the actual prices
    const actualValues = actualPrices.map(item => item.price);
    const minActual = Math.min(...actualValues);
    const maxActual = Math.max(...actualValues);
    const rangeActual = maxActual - minActual;

    actualPrices.forEach(actual => {
      const predicted = predictedPrices.find(pred => pred.date === actual.date);
      if (predicted) {
        // Original data MSE calculation
        const error = actual.price - predicted.price;
        sumSquaredErrors += error * error;

        // Normalized data MSE calculation
        const actualNorm = rangeActual > 0 ? (actual.price - minActual) / rangeActual : 0;
        const predictedNorm = rangeActual > 0 ? (predicted.price - minActual) / rangeActual : 0;
        const errorNorm = actualNorm - predictedNorm;
        sumSquaredErrorsNormalized += errorNorm * errorNorm;

        comparisonCount++;
      }
    });

    if (comparisonCount === 0) return null;

    const mseOriginal = sumSquaredErrors / comparisonCount;
    const mseNormalized = sumSquaredErrorsNormalized / comparisonCount;

    return {
      original: {
        mse: mseOriginal,
        rmse: Math.sqrt(mseOriginal)
      },
      normalized: {
        mse: mseNormalized,
        rmse: Math.sqrt(mseNormalized)
      },
      comparisonPeriod: `${actualPrices[0]?.date} to ${actualPrices[actualPrices.length - 1]?.date}`,
      dataPoints: comparisonCount,
      dataRange: {
        min: minActual,
        max: maxActual,
        range: rangeActual
      }
    };
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

          {/* Price Chart with Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">
                  Price Prediction Chart ({selectedTimeframe})
                </span>
                {(() => {
                  const accuracy = calculateAccuracy();
                  return accuracy && (
                    <div className="flex items-center space-x-2">
                      <Select value={accuracyDataType} onValueChange={(value: 'original' | 'normalized') => setAccuracyDataType(value)}>
                        <SelectTrigger className="w-32 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original Data</SelectItem>
                          <SelectItem value="normalized">Normalized Data</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="text-xs">
                        MSE: {accuracy[accuracyDataType].mse.toFixed(accuracyDataType === 'original' ? 3 : 6)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        RMSE: {accuracy[accuracyDataType].rmse.toFixed(accuracyDataType === 'original' ? 3 : 6)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {accuracy.dataPoints} days compared
                      </Badge>
                    </div>
                  );
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <strong>Chart Overview:</strong> Historical data (up to Jun 9) | <strong>Both actual & predicted lines visible Jun 10-14</strong> | Future predictions (Jun 15+)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-orange-500 mr-2"></div>
                    <span>Actual Price (Orange)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-blue-600 mr-2"></div>
                    <span>T-NCM-VAE Prediction (Blue)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-0.5 bg-gray-400 border-dashed border-t mr-2"></div>
                    <span>Confidence Bounds</span>
                  </div>
                </div>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
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
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return `${date.toLocaleDateString()} ${date >= new Date('2025-06-10') ? '(Prediction Period)' : '(Historical)'}`;
                      }}
                    />
                    <Legend />
                    
                    <Line 
                      type="monotone" 
                      dataKey="actualPrice" 
                      stroke="#ff7300" 
                      strokeWidth={3}
                      name="Actual Price"
                      connectNulls={false}
                      dot={{ r: 3 }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="predictedPrice" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      name="T-NCM-VAE Prediction"
                      connectNulls={false}
                      dot={{ r: 3 }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="upperBound" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Upper Confidence (95%)"
                      connectNulls={false}
                      dot={false}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="lowerBound" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      name="Lower Confidence (95%)"
                      connectNulls={false}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {(() => {
                const accuracy = calculateAccuracy();
                return accuracy && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Prediction Accuracy Analysis
                    </h4>
                    <div className="mb-3 flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-300 font-medium text-sm">Accuracy Calculation Type:</span>
                      <Select value={accuracyDataType} onValueChange={(value: 'original' | 'normalized') => setAccuracyDataType(value)}>
                        <SelectTrigger className="w-40 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original Data</SelectItem>
                          <SelectItem value="normalized">Normalized Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">MSE ({accuracyDataType}):</span>
                        <div className="text-lg font-bold text-green-900 dark:text-green-100">
                          {accuracy[accuracyDataType].mse.toFixed(accuracyDataType === 'original' ? 3 : 6)}
                        </div>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">RMSE ({accuracyDataType}):</span>
                        <div className="text-lg font-bold text-green-900 dark:text-green-100">
                          {accuracy[accuracyDataType].rmse.toFixed(accuracyDataType === 'original' ? 3 : 6)}
                        </div>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">Comparison Period:</span>
                        <div className="font-medium text-green-900 dark:text-green-100">
                          Jun 10-14, 2025
                        </div>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">Data Points:</span>
                        <div className="font-medium text-green-900 dark:text-green-100">
                          {accuracy.dataPoints} trading days
                        </div>
                      </div>
                    </div>
                    {accuracyDataType === 'normalized' && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <strong>Normalized Data Range:</strong> ${accuracy.dataRange.min.toFixed(2)} - ${accuracy.dataRange.max.toFixed(2)} 
                          (Range: ${accuracy.dataRange.range.toFixed(2)})
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Normalized values are scaled to [0,1] range for comparison independent of price magnitude.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Live Market Insights & Analysis</span>
                {predictionData.insights.liveMarketData && (
                  <Badge 
                    variant={predictionData.insights.liveMarketData.marketStatus === 'open' ? 'default' : 'secondary'}
                    className={predictionData.insights.liveMarketData.marketStatus === 'open' ? 'bg-green-500' : ''}
                  >
                    {predictionData.insights.liveMarketData.marketStatus.toUpperCase().replace('-', ' ')}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Live Market Status */}
              {predictionData.insights.liveMarketData && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Live Market Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-700 dark:text-blue-300">Next Earnings</p>
                      <p className="font-bold text-blue-900 dark:text-blue-100">
                        {predictionData.insights.liveMarketData.nextEarnings || 'TBD'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-700 dark:text-blue-300">Analyst Rating</p>
                      <div className="font-bold text-blue-900 dark:text-blue-100">
                        {predictionData.insights.liveMarketData.analystRating?.rating || 'N/A'}
                        {predictionData.insights.liveMarketData.analystRating?.targetPrice && (
                          <div className="text-xs">Target: ${predictionData.insights.liveMarketData.analystRating.targetPrice.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-700 dark:text-blue-300">Sector Rank</p>
                      <p className="font-bold text-blue-900 dark:text-blue-100">
                        #{predictionData.insights.liveMarketData.sectorPerformance.ranking}/11
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* News & Sentiment */}
              {predictionData.insights.newsAndSentiment && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Market Sentiment & News</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Overall Sentiment</p>
                        <Badge 
                          variant={
                            predictionData.insights.newsAndSentiment.sentiment === 'very-positive' || 
                            predictionData.insights.newsAndSentiment.sentiment === 'positive' ? 'default' :
                            predictionData.insights.newsAndSentiment.sentiment === 'very-negative' || 
                            predictionData.insights.newsAndSentiment.sentiment === 'negative' ? 'destructive' : 'secondary'
                          }
                          className={
                            predictionData.insights.newsAndSentiment.sentiment === 'very-positive' || 
                            predictionData.insights.newsAndSentiment.sentiment === 'positive' ? 'bg-green-500' : ''
                          }
                        >
                          {predictionData.insights.newsAndSentiment.sentiment.toUpperCase().replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h5 className="font-medium mb-3">Social Sentiment</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Bullish</span>
                            <div className="flex items-center">
                              <div className="w-20 h-2 bg-gray-200 rounded mr-2">
                                <div 
                                  className="h-full bg-green-500 rounded" 
                                  style={{ width: `${predictionData.insights.newsAndSentiment.socialSentiment.bullish}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{predictionData.insights.newsAndSentiment.socialSentiment.bullish.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Bearish</span>
                            <div className="flex items-center">
                              <div className="w-20 h-2 bg-gray-200 rounded mr-2">
                                <div 
                                  className="h-full bg-red-500 rounded" 
                                  style={{ width: `${predictionData.insights.newsAndSentiment.socialSentiment.bearish}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{predictionData.insights.newsAndSentiment.socialSentiment.bearish.toFixed(0)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-3">Recent News</h5>
                      <div className="space-y-3">
                        {predictionData.insights.newsAndSentiment.recentNews.slice(0, 3).map((news, index) => (
                          <div key={index} className="p-3 border border-muted rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <Badge 
                                variant={news.impact === 'high' ? 'destructive' : news.impact === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {news.impact.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(news.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{news.headline}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Market Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                      <p className="text-sm font-medium text-muted-foreground">MACD</p>
                      <p className="text-2xl font-bold">
                        {predictionData.insights.technicalIndicators.macd?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Stochastic</p>
                      <p className="text-2xl font-bold">
                        {predictionData.insights.technicalIndicators.stochastic?.toFixed(0) || 'N/A'}
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

              {/* Institutional & Advanced Metrics */}
              {predictionData.insights.liveMarketData && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Institutional Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-medium mb-3">Ownership Structure</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Institutional</span>
                          <span className="text-sm font-medium">{predictionData.insights.liveMarketData.institutionalOwnership?.toFixed(1) || 'N/A'}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Short Interest</span>
                          <span className="text-sm font-medium">{predictionData.insights.liveMarketData.shortInterest?.toFixed(1) || 'N/A'}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-medium mb-3">Market Correlations</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">S&P 500</span>
                          <span className="text-sm font-medium">{predictionData.insights.liveMarketData.correlations.sp500.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">NASDAQ</span>
                          <span className="text-sm font-medium">{predictionData.insights.liveMarketData.correlations.nasdaq.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Sector</span>
                          <span className="text-sm font-medium">{predictionData.insights.liveMarketData.correlations.sector.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h5 className="font-medium mb-3">Sector Performance</h5>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{predictionData.insights.liveMarketData.sectorPerformance.sector}</p>
                        <p className={`text-lg font-bold ${predictionData.insights.liveMarketData.sectorPerformance.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {predictionData.insights.liveMarketData.sectorPerformance.performance >= 0 ? '+' : ''}{predictionData.insights.liveMarketData.sectorPerformance.performance.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Rank #{predictionData.insights.liveMarketData.sectorPerformance.ranking}/11</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Timeframe Analysis */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Multi-Timeframe Performance Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {predictionData.insights.multiTimeframe && Object.entries(predictionData.insights.multiTimeframe).map(([period, analysis]) => (
                    <Card key={period} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{period.toUpperCase()} Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Change</span>
                          <span className={`text-sm font-bold ${analysis.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {analysis.priceChangePercent >= 0 ? '+' : ''}{analysis.priceChangePercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Volatility</span>
                          <span className="text-sm">{analysis.volatility.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Trend</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.trend}
                          </Badge>
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-muted-foreground">{analysis.momentum}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Fundamental Metrics */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Fundamental Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">P/E Ratio</p>
                    <p className="text-lg font-bold">{predictionData.insights.fundamentals?.peRatio?.toFixed(1) || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">EPS</p>
                    <p className="text-lg font-bold">${predictionData.insights.fundamentals?.eps?.toFixed(2) || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Dividend Yield</p>
                    <p className="text-lg font-bold">{predictionData.insights.fundamentals?.dividend?.toFixed(1) || 'N/A'}%</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">52W Range</p>
                    <p className="text-sm font-bold">
                      ${predictionData.insights.fundamentals?.weekRange52?.low?.toFixed(2) || 'N/A'} - 
                      ${predictionData.insights.fundamentals?.weekRange52?.high?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Technical Indicators */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Advanced Technical Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Moving Averages</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">MA50</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.ma50?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">MA200</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.ma200?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="pt-2 border-t border-muted">
                        <div className="text-xs text-muted-foreground">
                          {predictionData.insights.technicalIndicators.ma50 && predictionData.insights.technicalIndicators.ma200 && 
                           predictionData.insights.technicalIndicators.ma50 > predictionData.insights.technicalIndicators.ma200 
                            ? 'Golden Cross Signal' : 'Below MA200'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Bollinger Bands</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Upper</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.bollinger?.upper?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Middle</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.bollinger?.middle?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lower</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.bollinger?.lower?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="pt-2 border-t border-muted">
                        <div className="text-xs text-muted-foreground">
                          {currentPrice && predictionData.insights.technicalIndicators.bollinger ? 
                            (currentPrice.price > predictionData.insights.technicalIndicators.bollinger.upper ? 'Overbought Zone' :
                             currentPrice.price < predictionData.insights.technicalIndicators.bollinger.lower ? 'Oversold Zone' : 'Normal Range')
                            : 'Calculating...'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Support & Resistance</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Resistance</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.resistance?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Support</span>
                        <span className="text-sm font-medium">${predictionData.insights.technicalIndicators.support?.toFixed(2) || 'N/A'}</span>
                      </div>
                      <div className="pt-2 border-t border-muted">
                        <div className="text-xs text-muted-foreground">
                          {currentPrice && predictionData.insights.technicalIndicators.support && predictionData.insights.technicalIndicators.resistance ?
                            `${((currentPrice.price - predictionData.insights.technicalIndicators.support) / 
                                (predictionData.insights.technicalIndicators.resistance - predictionData.insights.technicalIndicators.support) * 100).toFixed(0)}% through range`
                            : 'Analyzing range...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Trading Indicators */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4">Live Trading Signals</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-3">Momentum Indicators</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">RSI Signal</p>
                        <p className="font-bold text-blue-900 dark:text-blue-100">
                          {predictionData.insights.technicalIndicators.rsi ? 
                            (predictionData.insights.technicalIndicators.rsi > 70 ? 'Overbought' :
                             predictionData.insights.technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">MACD Signal</p>
                        <p className={`font-bold ${predictionData.insights.technicalIndicators.macd && predictionData.insights.technicalIndicators.macd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {predictionData.insights.technicalIndicators.macd ? 
                            (predictionData.insights.technicalIndicators.macd > 0 ? 'Bullish' : 'Bearish')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-green-900 dark:text-green-100 mb-3">Volume Analysis</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700 dark:text-green-300">Current Volume</span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          {currentPrice ? `${(currentPrice.volume / 1000000).toFixed(1)}M` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700 dark:text-green-300">Avg Volume</span>
                        <span className="font-medium text-green-900 dark:text-green-100">
                          {predictionData.insights.fundamentals?.avgVolume ? 
                            `${(predictionData.insights.fundamentals.avgVolume / 1000000).toFixed(1)}M` : 'N/A'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-green-200 dark:border-green-800">
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {currentPrice && predictionData.insights.fundamentals?.avgVolume ?
                            `${((currentPrice.volume / predictionData.insights.fundamentals.avgVolume - 1) * 100).toFixed(0)}% vs avg`
                            : 'Calculating...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Events Timeline */}
              {predictionData.insights.multiTimeframe && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Recent Market Events</h4>
                  <div className="space-y-3">
                    {Object.entries(predictionData.insights.multiTimeframe).map(([period, analysis]) => (
                      <div key={period} className="border-l-4 border-blue-500 pl-4">
                        <h6 className="font-medium text-sm">{period.toUpperCase()} Period</h6>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {analysis.keyEvents.map((event, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {event}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Professional Market Analysis</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {predictionData.insights.summary}
                </p>
                <div className="pt-2 border-t border-muted">
                  <p className="text-sm font-medium text-muted-foreground">
                    Market Sentiment: {predictionData.insights.marketSentiment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}