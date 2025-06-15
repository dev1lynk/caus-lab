import { useState } from "react";
import Navigation from "@/components/Navigation";
import STStockPredictionDashboard from "@/components/STStockPredictionDashboard";
import VariableImpactAnalysis from "@/components/VariableImpactAnalysis";
import CounterfactualAnalysis from "@/components/CounterfactualAnalysis";
import StockPriceHeader from "@/components/StockPriceHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function STMDemo() {
  const [activeTab, setActiveTab] = useState("prediction");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                STM Stock Prediction Platform
              </h1>
              <p className="text-muted-foreground">
                Experience real-time semiconductor stock prediction powered by T-NCM-VAE AI
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <StockPriceHeader />
              <Badge variant="default" className="bg-blue-600">
                Live Demo
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max min-w-full justify-start md:grid md:grid-cols-4 gap-1">
              <TabsTrigger value="prediction" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">STM Stock Prediction</span>
                <span className="md:hidden">Predict</span>
              </TabsTrigger>
              <TabsTrigger value="variables" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Variable Impact</span>
                <span className="md:hidden">Variables</span>
              </TabsTrigger>
              <TabsTrigger value="counterfactual" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Counterfactual AI</span>
                <span className="md:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs md:text-sm px-2 md:px-4 whitespace-nowrap">
                <span className="hidden md:inline">Market Insights</span>
                <span className="md:hidden">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="prediction" className="space-y-8">
            <STStockPredictionDashboard />
          </TabsContent>

          <TabsContent value="variables" className="space-y-8">
            <VariableImpactAnalysis />
          </TabsContent>

          <TabsContent value="counterfactual" className="space-y-8">
            <CounterfactualAnalysis />
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <div className="grid gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg border">
                <h2 className="text-2xl font-bold mb-4">Market Insights</h2>
                <p className="text-muted-foreground mb-6">
                  Advanced market analysis and predictive insights for STMicroelectronics stock performance.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-600">Bullish Indicators</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                      <li>• Strong semiconductor demand</li>
                      <li>• AI chip market growth</li>
                      <li>• Automotive sector recovery</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-600">Risk Factors</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                      <li>• Supply chain volatility</li>
                      <li>• Geopolitical tensions</li>
                      <li>• Currency fluctuations</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-600">Technical Analysis</h3>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                      <li>• RSI: 47.2 (Neutral)</li>
                      <li>• MA50: $28.95</li>
                      <li>• Support: $27.50</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}