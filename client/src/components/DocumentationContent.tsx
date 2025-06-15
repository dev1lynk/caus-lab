import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Code, 
  Database, 
  TrendingUp, 
  Settings, 
  BarChart3,
  FileText,
  Lightbulb,
  Target,
  Zap,
  Download,
  ExternalLink
} from "lucide-react";

export default function DocumentationContent() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Platform Documentation
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive guides, tutorials, and reference materials to help you master 
          Causal AI's advanced scenario simulation capabilities.
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="api-reference">API Reference</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Platform Overview</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <h5 className="font-medium">Data Upload & Validation</h5>
                          <p className="text-sm text-gray-600">Upload CSV, Excel, or JSON files with time-series data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <h5 className="font-medium">Variable Configuration</h5>
                          <p className="text-sm text-gray-600">Define variables and their causal relationships</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <h5 className="font-medium">AI Model Training</h5>
                          <p className="text-sm text-gray-600">T-NCM-VAE model learns patterns and relationships</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <h5 className="font-medium">Scenario Simulation</h5>
                          <p className="text-sm text-gray-600">Generate predictions and run what-if analyses</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">System Requirements</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Data Format:</span>
                        <span className="text-sm">CSV, Excel, JSON</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Min Dataset Size:</span>
                        <span className="text-sm">100+ rows</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Variables (Free):</span>
                        <span className="text-sm">5 variables</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Max Variables (Premium):</span>
                        <span className="text-sm">50 variables</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Browser Support:</span>
                        <span className="text-sm">Chrome, Firefox, Safari</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Supported Industries</h5>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Semiconductors</Badge>
                        <Badge variant="outline" className="text-xs">Manufacturing</Badge>
                        <Badge variant="outline" className="text-xs">Finance</Badge>
                        <Badge variant="outline" className="text-xs">Supply Chain</Badge>
                        <Badge variant="outline" className="text-xs">Healthcare</Badge>
                        <Badge variant="outline" className="text-xs">Energy</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-600" />
                  Data Preparation Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Data Format Requirements</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Time-series data with consistent intervals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Date/timestamp column in ISO format</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Numerical values for causal variables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Minimal missing values (&lt;10%)</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3">Quality Checklist</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Remove duplicate entries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Handle outliers appropriately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Normalize units and scales</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Validate data relationships</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Stock Price Prediction
                </CardTitle>
                <Badge variant="secondary" className="w-fit">15 minutes</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Learn to build a comprehensive stock prediction model using semiconductor industry data with 15 key variables.
                </p>
                <div className="space-y-2">
                  <h6 className="font-medium text-sm">What you'll learn:</h6>
                  <ul className="text-xs space-y-1">
                    <li>• Financial data preprocessing</li>
                    <li>• Market indicator integration</li>
                    <li>• T-NCM-VAE model training</li>
                    <li>• Prediction accuracy assessment</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                  Variable Impact Analysis
                </CardTitle>
                <Badge variant="secondary" className="w-fit">20 minutes</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Master the art of variable configuration and understand how different factors influence your target outcomes.
                </p>
                <div className="space-y-2">
                  <h6 className="font-medium text-sm">What you'll learn:</h6>
                  <ul className="text-xs space-y-1">
                    <li>• Variable categorization strategies</li>
                    <li>• Causal relationship mapping</li>
                    <li>• Impact sensitivity analysis</li>
                    <li>• Real-time adjustment techniques</li>
                  </ul>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Scenario Simulation
                </CardTitle>
                <Badge variant="secondary" className="w-fit">25 minutes</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Create powerful what-if scenarios to test different business strategies and market conditions.
                </p>
                <div className="space-y-2">
                  <h6 className="font-medium text-sm">What you'll learn:</h6>
                  <ul className="text-xs space-y-1">
                    <li>• Scenario design principles</li>
                    <li>• Intervention strategies</li>
                    <li>• Counterfactual analysis</li>
                    <li>• Results interpretation</li>
                  </ul>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                  Advanced Techniques
                </CardTitle>
                <Badge variant="secondary" className="w-fit">35 minutes</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Explore advanced modeling techniques and optimization strategies for complex business scenarios.
                </p>
                <div className="space-y-2">
                  <h6 className="font-medium text-sm">What you'll learn:</h6>
                  <ul className="text-xs space-y-1">
                    <li>• Multi-objective optimization</li>
                    <li>• Uncertainty quantification</li>
                    <li>• Model ensemble techniques</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Start Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api-reference" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Stock Prediction API</h5>
                    <Badge variant="outline" className="text-green-600 border-green-200">GET</Badge>
                  </div>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    /api/stock/predict?symbol=STM&timeframe=30d
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Generate stock price predictions using the T-NCM-VAE model
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Variable Impact Analysis</h5>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">POST</Badge>
                  </div>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    /api/variables/impact
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Analyze the impact of variable changes on target outcomes
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Counterfactual Simulation</h5>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">POST</Badge>
                  </div>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    /api/counterfactual/generate
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Generate counterfactual scenarios using causal intervention
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Model Information</h5>
                    <Badge variant="outline" className="text-green-600 border-green-200">GET</Badge>
                  </div>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block">
                    /api/model-info
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Retrieve information about the active T-NCM-VAE model
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-6">
          <div className="grid gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Modeling Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3 text-green-600">✓ Do These</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Start with domain knowledge when defining variables</li>
                      <li>• Use sufficient historical data (6+ months)</li>
                      <li>• Validate causal assumptions with subject experts</li>
                      <li>• Test multiple scenario configurations</li>
                      <li>• Monitor model performance regularly</li>
                      <li>• Document your modeling decisions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3 text-red-600">✗ Avoid These</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• Including too many highly correlated variables</li>
                      <li>• Making causal claims without proper validation</li>
                      <li>• Using insufficient data for training</li>
                      <li>• Ignoring outliers without investigation</li>
                      <li>• Over-interpreting short-term predictions</li>
                      <li>• Neglecting model uncertainty estimates</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h6 className="font-medium mb-2">Model Training Tips</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Use balanced datasets with representative samples</li>
                      <li>• Implement proper data preprocessing pipelines</li>
                      <li>• Monitor training convergence metrics</li>
                      <li>• Apply regularization to prevent overfitting</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h6 className="font-medium mb-2">Prediction Accuracy</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Validate predictions against holdout data</li>
                      <li>• Use multiple evaluation metrics (MAPE, RMSE, etc.)</li>
                      <li>• Consider forecast horizons appropriate for your use case</li>
                      <li>• Regularly retrain models with new data</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h6 className="font-medium mb-2">Scenario Design</h6>
                    <ul className="text-sm space-y-1">
                      <li>• Design realistic intervention scenarios</li>
                      <li>• Test edge cases and extreme conditions</li>
                      <li>• Compare multiple alternative strategies</li>
                      <li>• Document assumptions and limitations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <CardTitle>Quick Links & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6" />
              <span className="font-medium">Sample Datasets</span>
              <span className="text-xs text-gray-500">Download example data</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span className="font-medium">PDF Guides</span>
              <span className="text-xs text-gray-500">Detailed documentation</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <ExternalLink className="w-6 h-6" />
              <span className="font-medium">Video Tutorials</span>
              <span className="text-xs text-gray-500">Step-by-step videos</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}