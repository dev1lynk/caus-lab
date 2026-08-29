import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Target,
} from "lucide-react";

export default function ProjectWorkflow() {
  const workflowSteps = [
    {
      step: 1,
      title: "Data Upload & Validation",
      description: "Upload your time-series data and let our AI validate the structure",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      features: [
        "CSV, Excel, and JSON support",
        "Automatic data quality checks",
        "Missing value detection",
        "Time-series validation"
      ],
      visualElements: [
        { icon: FileSpreadsheet, label: "CSV Files" },
        { icon: Database, label: "Data Validation" },
        { icon: CheckCircle, label: "Quality Check" }
      ]
    },
    {
      step: 2,
      title: "Variable Configuration",
      description: "Define your variables and their relationships in the causal model",
      icon: Settings,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      features: [
        "Drag-and-drop variable setup",
        "Causal relationship mapping",
        "Impact strength configuration",
        "Variable categorization"
      ],
      visualElements: [
        { icon: Target, label: "Variables" },
        { icon: GitBranch, label: "Relationships" },
        { icon: Settings, label: "Configuration" }
      ]
    },
    {
      step: 3,
      title: "Temporal Causal Foundation Model training",
      description: "Our advanced AI model learns the causal patterns in your data",
      icon: Brain,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-700",
      features: [
        "Neural causal modeling",
        "Variational autoencoder training",
        "Pattern recognition",
        "Real-time model updates"
      ],
      visualElements: [
        { icon: Brain, label: "AI Training" },
        { icon: Network, label: "Neural Network" },
        { icon: Activity, label: "Learning" }
      ]
    },
    {
      step: 4,
      title: "Results & Simulation",
      description: "Generate predictions and run what-if scenarios with your trained model",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-700",
      features: [
        "Interactive dashboards",
        "Scenario simulation",
        "Counterfactual analysis",
        "Executive summaries"
      ],
      visualElements: [
        { icon: BarChart3, label: "Analytics" },
        { icon: TrendingUp, label: "Predictions" },
        { icon: Zap, label: "Simulations" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          CAUS Lab Project Workflow
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience the power of generative scenario simulation through our intuitive 4-step process. 
          From data upload to actionable insights, CAUS Lab transforms your raw data into predictive intelligence.
        </p>
      </div>

      {/* Workflow Steps */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 dark:from-blue-700 dark:via-purple-700 dark:via-green-700 dark:to-orange-700 transform -translate-y-1/2"></div>
        
        <div className="grid lg:grid-cols-4 gap-8 relative z-10">
          {workflowSteps.map((step, index) => {
            const StepIcon = step.icon;
            
            return (
              <Card key={step.step} className={`${step.borderColor} ${step.bgColor} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="text-center pb-4">
                  {/* Step Number */}
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {step.step}
                  </div>
                  
                  {/* Step Icon */}
                  <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center`}>
                    <StepIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Visual Elements */}
                  <div className="flex justify-center gap-2 mb-4">
                    {step.visualElements.map((element, idx) => {
                      const ElementIcon = element.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`w-8 h-8 bg-gradient-to-br ${step.color} rounded-md flex items-center justify-center mb-1`}>
                            <ElementIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {element.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          step.step === 1 ? 'text-blue-600' :
                          step.step === 2 ? 'text-purple-600' :
                          step.step === 3 ? 'text-green-600' :
                          'text-orange-600'
                        }`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Arrow to Next Step */}
                  {index < workflowSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}