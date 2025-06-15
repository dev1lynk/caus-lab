import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Brain, ChartGantt } from "lucide-react";

import STStockPredictionDashboard from "@/components/STStockPredictionDashboard";
import CounterfactualAnalysis from "@/components/CounterfactualAnalysis";
import StockPriceHeader from "@/components/StockPriceHeader";
import VariableImpactAnalysis from "@/components/VariableImpactAnalysis";
import Footer from "@/components/Footer";

export default function STMDemo() {
  const [activeTab, setActiveTab] = useState("variables");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Causal AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">STM Stock Prediction Demo</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/workflow">
              <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                ← Back to Workflow
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                STM Stock Prediction Platform
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Experience real-time semiconductor stock analysis with T-NCM-VAE AI model
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
            <TabsList className="flex w-max min-w-full justify-start md:grid md:grid-cols-3 gap-1">
              <TabsTrigger value="variables" className="text-xs md:text-sm px-4 md:px-6 whitespace-nowrap">
                <span className="hidden md:inline">Variable Impact Analysis</span>
                <span className="md:hidden">Variables</span>
              </TabsTrigger>
              <TabsTrigger value="counterfactual" className="text-xs md:text-sm px-4 md:px-6 whitespace-nowrap">
                <span className="hidden md:inline">Counterfactual AI</span>
                <span className="md:hidden">AI Scenarios</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs md:text-sm px-4 md:px-6 whitespace-nowrap">
                <span className="hidden md:inline">Market Insights</span>
                <span className="md:hidden">Insights</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="variables" className="space-y-8">
            <VariableImpactAnalysis />
          </TabsContent>

          <TabsContent value="counterfactual" className="space-y-8">
            <CounterfactualAnalysis />
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <STStockPredictionDashboard />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}