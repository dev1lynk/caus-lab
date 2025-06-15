import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Upload, 
  Settings, 
  Brain, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  FileSpreadsheet,
  Network,
  Zap,
  TrendingUp,
  Database,
  GitBranch,
  Activity,
  Target
} from "lucide-react";
import ProjectWorkflow from "@/components/ProjectWorkflow";

export default function WorkflowLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Causal AI</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Generative Scenario Simulation</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard?tab=projects">
              <Button variant="ghost">Projects</Button>
            </Link>
            <Link href="/dashboard?tab=documentation">
              <Button variant="ghost">Documentation</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Build Your Causal AI Model
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Follow our intuitive 4-step process to transform your data into predictive intelligence.
            From upload to insights, experience the power of generative scenario simulation.
          </p>
        </div>

        {/* Workflow Component */}
        <div className="mb-16">
          <ProjectWorkflow />
        </div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">STM Stock Prediction Demo</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Experience real-time semiconductor stock analysis
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-xs text-gray-500">Variables</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Real-time</div>
                  <div className="text-xs text-gray-500">Updates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">T-NCM-VAE</div>
                  <div className="text-xs text-gray-500">AI Model</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Variable impact analysis with 15 STM parameters</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Counterfactual scenario generation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Real-time market insights</span>
                </div>
              </div>
              <Link href="/stm-demo">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Try STM Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Custom Project</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Upload your data and build specialized models
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200">Finance & Investment</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">Manufacturing</Badge>
                <Badge variant="outline" className="text-green-600 border-green-200">Supply Chain</Badge>
                <Badge variant="outline" className="text-orange-600 border-orange-200">Healthcare</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">CSV, Excel, and JSON data support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom variable configuration</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Industry-specific templates</span>
                </div>
              </div>
              <Link href="/dashboard?tab=projects">
                <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                  Start Custom Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Decision-Making?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the future of predictive analytics with Causal AI. Start building scenarios that 
            shape your business outcomes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/stm-demo">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8">
                Start Simulation Now
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard?tab=documentation">
              <Button size="lg" variant="outline" className="px-8">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}