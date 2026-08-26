import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  MessageCircle,
  Users,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Causal Diagnostic",
    summary: "A focused engagement to answer one specific question.",
    body: "Is this relationship in your data actually causal, or are you looking at a correlation dressed up as one? We map the relevant variables, identify what's likely confounding the picture, and tell you plainly what the data can and can't support. This is often the right starting point if you're not sure causal inference applies to your situation yet.",
    icon: Compass,
  },
  {
    title: "Advisory & Strategic Guidance",
    summary: "Independent, technically grounded guidance for important decisions.",
    body: "Ongoing or project-based advisory for teams evaluating whether and how to build causal inference into their decision-making—from evaluating vendor platforms, to scoping an internal pilot, to reviewing a model or analysis your team has already built. We act as an independent, technically grounded second opinion.",
    icon: MessageCircle,
  },
  {
    title: "Embedded Project Work",
    summary: "Hands-on collaboration with your team on a defined causal project.",
    body: "We can build a causal model for a specific business question, design an experiment or natural-experiment analysis, or audit an existing predictive model for causal validity before it drives a major decision.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Workshops & Team Training",
    summary: "A practical introduction to causal thinking for your team.",
    body: "Your analytics, strategy, or product team will learn enough to recognize when they're looking at a causal question and when to bring in deeper expertise. Sessions are tailored to your industry and existing data maturity.",
    icon: Users,
  },
];

export default function OurService() {
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

          <header className="mb-14 max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 bg-white/70 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                CAUS Lab services
              </Badge>
            </div>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-6xl">
              What We Do
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              CAUS helps companies figure out where cause-and-effect actually matters to a decision—and where it doesn't.
            </p>
          </header>

          <section className="mb-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-blue-100 bg-white/85 shadow-sm backdrop-blur dark:border-blue-900/60 dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-950 dark:text-white">The gap we work in</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Most organizations are excellent at prediction and surprisingly under-equipped to answer a simpler question: if we change this, what will actually happen? That's the gap we work in.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-gradient-to-br from-indigo-950 to-purple-950 text-white shadow-sm">
              <CardContent className="flex h-full flex-col justify-between p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">Our focus</p>
                <p className="mt-6 text-2xl font-semibold leading-snug">
                  Get the “why” right before it becomes an expensive decision.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-16">
            <div className="mb-7 max-w-3xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">Who We Work With</p>
              <h2 className="mb-4 text-3xl font-bold text-gray-950 dark:text-white md:text-4xl">
                For teams making high-stakes decisions
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                Leadership teams and analytics functions who are past the “what is machine learning” stage and are now facing a decision where getting the why wrong is expensive—a pricing change, a marketing spend reallocation, a process redesign, or a policy decision.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70 md:p-8">
              <div className="flex gap-4">
                <Users className="mt-1 h-6 w-6 shrink-0 text-blue-600 dark:text-blue-300" />
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  You don't need an existing data science team to start a conversation with us, but the work is most valuable to organizations that already have data and want to know if they're reading it correctly.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-300">What We Offer</p>
              <h2 className="text-3xl font-bold text-gray-950 dark:text-white md:text-4xl">
                Practical help for causal questions
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {services.map(({ title, summary, body, icon: Icon }) => (
                <Card key={title} className="border-white/70 bg-white/80 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                  <CardHeader>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl text-gray-950 dark:text-white">{title}</CardTitle>
                    <p className="pt-1 text-sm font-medium leading-relaxed text-blue-700 dark:text-blue-300">{summary}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="mb-16 grid gap-6 md:grid-cols-2">
            <Card className="border-blue-100 bg-blue-50/80 dark:border-blue-900/60 dark:bg-blue-950/30">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  <Compass className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl text-blue-950 dark:text-blue-100">How We Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-blue-900 dark:text-blue-200">
                  We keep engagements small, direct, and outcome-specific. Every engagement starts with a conversation about the actual decision you're trying to get right, and we scope from there.
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-100 bg-purple-50/80 dark:border-purple-900/60 dark:bg-purple-950/30">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl text-purple-950 dark:text-purple-100">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-purple-900 dark:text-purple-200">
                  If you're not sure whether your question is a causal one, that's a good reason to reach out, not a reason to wait.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="border-t border-gray-200 pt-8 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                <span>Start with the decision you want to get right.</span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/terminology">
                  <Button variant="outline">Learn the language</Button>
                </Link>
                <Link href="/workflow">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Explore CAUS Lab
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}