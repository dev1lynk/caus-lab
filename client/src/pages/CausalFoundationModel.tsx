import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  Lightbulb,
  Scale,
  Sparkles,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foundationPrinciples = [
  {
    icon: GitBranch,
    title: "A map of how the world works",
    body: "A causal foundation model represents variables and the relationships between them. It can connect an action, the mechanisms it changes, and the outcomes that follow.",
  },
  {
    icon: Lightbulb,
    title: "Built for what-if questions",
    body: "Instead of stopping at patterns in historical data, the model helps estimate what could happen after an intervention—such as changing a price, policy, or treatment.",
  },
  {
    icon: Sparkles,
    title: "Reusable causal knowledge",
    body: "Like a foundation model in other fields, it is designed to generalize across related situations. New data and domain context can refine the model without starting from zero.",
  },
];

const causalQuestions = [
  "Would a 10% discount cause more repeat purchases?",
  "What would happen to churn if we improved onboarding?",
  "Which customers would benefit most from a retention offer?",
  "Did the new policy cause the reduction in processing time?",
  "What is the likely effect of increasing staffing at peak hours?",
];

const regressionQuestions = [
  "How strongly is revenue associated with advertising spend?",
  "How accurately can we predict next month’s sales from current features?",
  "What is the expected delivery time for an order with these attributes?",
  "Which variables are useful for predicting customer churn?",
  "How does the average outcome change across observed price levels?",
];

export default function CausalFoundationModel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-blue-700 transition-colors hover:text-purple-700 dark:text-blue-300 dark:hover:text-purple-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CAUS Lab
          </Link>

          <header className="mb-12 max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 bg-white/70 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                CAUS Lab fundamentals
              </Badge>
            </div>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-6xl">
              What is a causal foundation model?
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              A causal foundation model is a general-purpose system for understanding cause and effect. It combines structured causal knowledge, data, and domain context to reason about interventions and their possible consequences.
            </p>
          </header>

          <section className="mb-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-blue-100 bg-white/85 shadow-sm backdrop-blur dark:border-blue-900/60 dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-950 dark:text-white">The basic idea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  Most machine-learning systems learn to recognize patterns: when inputs look like this, an outcome often looks like that. A causal model goes one step further by representing the mechanisms that connect those variables.
                </p>
                <p className="leading-relaxed">
                  That distinction matters whenever you need to make a decision. If a model predicts that customers who receive a discount spend more, it does not automatically mean the discount caused the extra spending. A causal model asks what would have happened to comparable customers without the discount.
                </p>
                <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                  <p className="font-semibold text-blue-900 dark:text-blue-200">In one sentence</p>
                  <p className="mt-1 leading-relaxed text-blue-800 dark:text-blue-300">
                    A causal foundation model helps turn “what is likely?” into “what would happen if we changed something?”
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-purple-100 bg-gradient-to-br from-indigo-950 to-purple-950 text-white shadow-sm">
              <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-200">A causal chain</p>
                  <div className="space-y-3">
                    {["Intervention", "Mechanism", "Outcome"].map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-lg font-semibold">{item}</span>
                        {index < 2 && <ArrowRight className="ml-auto h-4 w-4 text-blue-200" />}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-8 leading-relaxed text-indigo-100">
                  Change the lever, trace the pathway, and estimate the result—not just the correlation you happened to observe.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-16">
            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">Core capabilities</p>
              <h2 className="text-3xl font-bold text-gray-950 dark:text-white md:text-4xl">What makes it causal?</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {foundationPrinciples.map(({ icon: Icon, title, body }) => (
                <Card key={title} className="border-white/70 bg-white/75 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-950 dark:text-white">{title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur md:p-10 dark:border-gray-800 dark:bg-gray-900/75">
            <div className="mb-8 max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Scale className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Important distinction</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-950 dark:text-white md:text-4xl">
                What are the differences between a causal inference model and a regression model?
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Regression is a statistical tool that describes or predicts relationships in observed data. Causal inference is a framework for estimating the effect of an action. Regression can be part of a causal analysis, but a regression line alone does not establish causation.
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/30 md:p-7">
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">Statistical inference</span> is about finding patterns in what we already observe (<span className="font-medium">What is the relationship if I see X?</span>), while <span className="font-semibold text-purple-900 dark:text-purple-200">causal inference</span> is about understanding what happens when we actively change a system or imagine alternative realities (<span className="font-medium">What happens if I change X?</span>).
              </p>
              <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300">
                In mathematical terms this translates to <span className="rounded bg-white px-2 py-1 font-mono text-sm font-semibold text-blue-800 shadow-sm dark:bg-gray-900 dark:text-blue-200">Estimate P(Y∣X)</span> vs. <span className="rounded bg-white px-2 py-1 font-mono text-sm font-semibold text-purple-800 shadow-sm dark:bg-gray-900 dark:text-purple-200">Estimate P(Y∣do(X))</span>. For the first, the observation is sufficient, whereas for the second you need the interventional context.
              </p>
            </div>

            <div className="mb-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-blue-100 bg-white/80 p-5 dark:border-blue-900/60 dark:bg-gray-950/40">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Observed data</p>
                    <h3 className="mt-1 text-lg font-bold text-gray-950 dark:text-white">Statistical inference</h3>
                  </div>
                  <span className="rounded-md bg-blue-100 px-2 py-1 font-mono text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">P(Y∣X)</span>
                </div>
                <div className="relative h-44 overflow-hidden rounded-lg bg-blue-50/80 p-4 dark:bg-blue-950/30" aria-label="Observed graph with a shared cause">
                  <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">Context U</div>
                  <div className="absolute bottom-4 left-[18%] rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm dark:border-blue-800 dark:bg-gray-900 dark:text-blue-200">X</div>
                  <div className="absolute bottom-4 right-[18%] rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm dark:border-blue-800 dark:bg-gray-900 dark:text-blue-200">Y</div>
                  <span className="absolute left-[30%] top-[37%] rotate-[25deg] text-lg text-gray-400" aria-hidden="true">↙</span>
                  <span className="absolute right-[30%] top-[37%] rotate-[-25deg] text-lg text-gray-400" aria-hidden="true">↘</span>
                  <span className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-lg text-blue-400" aria-hidden="true">→</span>
                  <p className="absolute bottom-1 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400">Patterns can reflect X, Y, and shared context</p>
                </div>
              </div>

              <div className="rounded-xl border border-purple-100 bg-white/80 p-5 dark:border-purple-900/60 dark:bg-gray-950/40">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Active intervention</p>
                    <h3 className="mt-1 text-lg font-bold text-gray-950 dark:text-white">Causal inference</h3>
                  </div>
                  <span className="rounded-md bg-purple-100 px-2 py-1 font-mono text-xs font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-200">P(Y∣do(X))</span>
                </div>
                <div className="relative h-44 overflow-hidden rounded-lg bg-purple-50/80 p-4 dark:bg-purple-950/30" aria-label="Intervention graph with X set externally">
                  <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 line-through dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">Context → X</div>
                  <div className="absolute bottom-4 left-[18%] rounded-lg border border-purple-200 bg-purple-600 px-3 py-2 text-sm font-bold text-white shadow-sm dark:border-purple-500">do(X)</div>
                  <div className="absolute bottom-4 right-[18%] rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-bold text-purple-800 shadow-sm dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200">Y</div>
                  <span className="absolute bottom-[28%] left-[39%] text-lg font-bold text-purple-500" aria-hidden="true">→</span>
                  <p className="absolute bottom-1 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400">Set X, then trace its effect on Y</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>
                    <th className="w-1/4 px-4 py-4 font-bold text-gray-900 dark:text-white">Dimension</th>
                    <th className="w-[37.5%] px-4 py-4 font-bold text-blue-800 dark:text-blue-200">Causal inference</th>
                    <th className="w-[37.5%] px-4 py-4 font-bold text-purple-800 dark:text-purple-200">Regression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200">Primary goal</th>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">Estimate the change caused by an intervention.</td>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">Describe associations or predict outcomes.</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200">Core question</th>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">What would happen if we changed X?</td>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">What outcome is associated with observed X?</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200">What it needs</th>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">A research design or causal assumptions, such as randomization, exchangeability, and a valid DAG.</td>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">A well-specified statistical relationship and data representative of the prediction task.</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200">Main risk</th>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">Confounding or bias can make the estimated effect differ from the true intervention effect.</td>
                    <td className="px-4 py-4 leading-relaxed text-gray-600 dark:text-gray-300">A strong association can still be a poor predictor when the data distribution changes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12 grid gap-6 md:grid-cols-2">
            <Card className="border-blue-100 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/30">
              <CardHeader>
                <CardTitle className="text-xl text-blue-950 dark:text-blue-100">Causal model questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {causalQuestions.map((question) => (
                    <li key={question} className="flex gap-3 text-sm leading-relaxed text-blue-900 dark:text-blue-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-purple-50/80 dark:border-purple-900/60 dark:bg-purple-950/30">
              <CardHeader>
                <CardTitle className="text-xl text-purple-950 dark:text-purple-100">Regression model questions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {regressionQuestions.map((question) => (
                    <li key={question} className="flex gap-3 text-sm leading-relaxed text-purple-900 dark:text-purple-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ready to explore the concepts in context?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/terminology">
                <Button variant="outline">Browse terminology</Button>
              </Link>
              <Link href="/workflow">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Explore CAUS Lab workflow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}