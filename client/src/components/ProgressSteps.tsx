import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Upload Data" },
  { number: 2, label: "Build Causal Graph" },
  { number: 3, label: "Train Model" },
  { number: 4, label: "Simulate & Results" },
];

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Project Workflow</h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step.number <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium transition-colors",
                  step.number <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
