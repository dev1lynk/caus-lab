import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Zap } from "lucide-react";

export default function WorkflowGuidance() {
  return (
    <div className="grid gap-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Modeling Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h5 className="mb-3 font-medium text-green-600">✓ Do These</h5>
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
              <h5 className="mb-3 font-medium text-red-600">✗ Avoid These</h5>
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
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h6 className="mb-2 font-medium">Model Training Tips</h6>
              <ul className="space-y-1 text-sm">
                <li>• Use balanced datasets with representative samples</li>
                <li>• Implement proper data preprocessing pipelines</li>
                <li>• Monitor training convergence metrics</li>
                <li>• Apply regularization to prevent overfitting</li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <h6 className="mb-2 font-medium">Prediction Accuracy</h6>
              <ul className="space-y-1 text-sm">
                <li>• Validate predictions against holdout data</li>
                <li>• Use multiple evaluation metrics (MAPE, RMSE, etc.)</li>
                <li>• Consider forecast horizons appropriate for your use case</li>
                <li>• Regularly retrain models with new data</li>
              </ul>
            </div>

            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <h6 className="mb-2 font-medium">Scenario Design</h6>
              <ul className="space-y-1 text-sm">
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
  );
}