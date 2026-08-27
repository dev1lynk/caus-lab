import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  Lightbulb,
  Network,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Position = { x: number; y: number };

type Variable = {
  id: string;
  label: string;
  role: "input" | "mechanism" | "outcome";
  baseline: number;
  unit: string;
  position: Position;
};

type Edge = {
  from: string;
  to: string;
  weight: number;
};

type Intervention = {
  label: string;
  target: string;
  delta: number;
  summary: string;
};

type Application = {
  id: string;
  industry: string;
  title: string;
  description: string;
  causalQuestion: string;
  variables: Variable[];
  edges: Edge[];
  interventions: Intervention[];
};

const applications: Application[] = [
  {
    id: "retail",
    industry: "Retail",
    title: "Promotion & repeat purchase",
    description: "Understand which commercial levers create sustainable revenue, rather than simply correlate with it.",
    causalQuestion: "What would happen to monthly revenue if we increased promotional support for high-intent customers?",
    variables: [
      { id: "marketing", label: "Marketing spend", role: "input", baseline: 100, unit: "index", position: { x: 90, y: 76 } },
      { id: "promotion", label: "Promotion depth", role: "input", baseline: 10, unit: "%", position: { x: 90, y: 204 } },
      { id: "traffic", label: "Website traffic", role: "mechanism", baseline: 64, unit: "k visits", position: { x: 330, y: 76 } },
      { id: "conversion", label: "Conversion rate", role: "mechanism", baseline: 4.2, unit: "%", position: { x: 330, y: 204 } },
      { id: "revenue", label: "Monthly revenue", role: "outcome", baseline: 420, unit: "$k", position: { x: 610, y: 140 } },
    ],
    edges: [
      { from: "marketing", to: "traffic", weight: 0.62 },
      { from: "promotion", to: "conversion", weight: 0.48 },
      { from: "traffic", to: "conversion", weight: 0.55 },
      { from: "conversion", to: "revenue", weight: 0.82 },
    ],
    interventions: [
      { label: "Increase marketing spend", target: "marketing", delta: 20, summary: "Increase acquisition investment by 20 index points." },
      { label: "Deepen promotion", target: "promotion", delta: 5, summary: "Increase the average promotional discount by 5 percentage points." },
      { label: "Improve landing page", target: "conversion", delta: 0.8, summary: "Lift conversion rate directly through a better experience." },
      { label: "Target high-intent traffic", target: "traffic", delta: 12, summary: "Add 12k monthly visits from a higher-intent audience." },
      { label: "Bundle loyalty offer", target: "promotion", delta: 8, summary: "Test a loyalty bundle with an 8-point promotional lift." },
    ],
  },
  {
    id: "healthcare",
    industry: "Healthcare",
    title: "Care coordination & readmission",
    description: "Trace how operational changes influence adherence, recovery, and patient outcomes.",
    causalQuestion: "Would adding a care coordinator reduce 30-day readmission risk for high-risk patients?",
    variables: [
      { id: "coordination", label: "Care coordination", role: "input", baseline: 40, unit: "index", position: { x: 90, y: 76 } },
      { id: "wait", label: "Follow-up wait", role: "mechanism", baseline: 7, unit: "days", position: { x: 90, y: 204 } },
      { id: "adherence", label: "Treatment adherence", role: "mechanism", baseline: 68, unit: "%", position: { x: 330, y: 76 } },
      { id: "risk", label: "Readmission risk", role: "mechanism", baseline: 18, unit: "%", position: { x: 330, y: 204 } },
      { id: "outcomes", label: "Patient outcomes", role: "outcome", baseline: 72, unit: "index", position: { x: 610, y: 140 } },
    ],
    edges: [
      { from: "coordination", to: "wait", weight: -0.42 },
      { from: "coordination", to: "adherence", weight: 0.58 },
      { from: "wait", to: "risk", weight: 0.64 },
      { from: "adherence", to: "risk", weight: -0.7 },
      { from: "risk", to: "outcomes", weight: -0.76 },
    ],
    interventions: [
      { label: "Add care coordinator", target: "coordination", delta: 18, summary: "Increase coordinated follow-up capacity by 18 index points." },
      { label: "Shorten follow-up wait", target: "wait", delta: -3, summary: "Reduce the average follow-up wait by three days." },
      { label: "Medication reminders", target: "adherence", delta: 10, summary: "Improve adherence with a structured reminder program." },
      { label: "High-risk outreach", target: "coordination", delta: 25, summary: "Prioritize outreach for the highest-risk patient group." },
      { label: "Discharge checklist", target: "wait", delta: -1.5, summary: "Remove one and a half days from the transition process." },
    ],
  },
  {
    id: "manufacturing",
    industry: "Manufacturing",
    title: "Maintenance & production quality",
    description: "See how maintenance choices affect throughput, defects, and the cost of every unit produced.",
    causalQuestion: "What is the effect of increasing preventive maintenance on downtime and unit cost?",
    variables: [
      { id: "maintenance", label: "Preventive maintenance", role: "input", baseline: 55, unit: "index", position: { x: 90, y: 76 } },
      { id: "downtime", label: "Unplanned downtime", role: "mechanism", baseline: 12, unit: "hours", position: { x: 90, y: 204 } },
      { id: "throughput", label: "Throughput", role: "mechanism", baseline: 820, unit: "units/day", position: { x: 330, y: 76 } },
      { id: "defects", label: "Defect rate", role: "mechanism", baseline: 3.8, unit: "%", position: { x: 330, y: 204 } },
      { id: "unitcost", label: "Unit cost", role: "outcome", baseline: 14.5, unit: "$/unit", position: { x: 610, y: 140 } },
    ],
    edges: [
      { from: "maintenance", to: "downtime", weight: -0.65 },
      { from: "maintenance", to: "defects", weight: -0.34 },
      { from: "downtime", to: "throughput", weight: -0.72 },
      { from: "throughput", to: "unitcost", weight: -0.55 },
      { from: "defects", to: "unitcost", weight: 0.62 },
    ],
    interventions: [
      { label: "Increase maintenance", target: "maintenance", delta: 15, summary: "Increase the preventive maintenance program by 15 index points." },
      { label: "Add spare capacity", target: "throughput", delta: 100, summary: "Add 100 units per day of planned production capacity." },
      { label: "Quality training", target: "defects", delta: -1.2, summary: "Reduce defects through targeted operator training." },
      { label: "Replace aging equipment", target: "maintenance", delta: 22, summary: "Fund a replacement cycle for the most failure-prone equipment." },
      { label: "Weekend maintenance", target: "downtime", delta: -4, summary: "Remove four hours of expected downtime through scheduled work." },
    ],
  },
  {
    id: "energy",
    industry: "Energy",
    title: "Storage & grid emissions",
    description: "Model how capacity and demand management can shift cost and carbon intensity across the grid.",
    causalQuestion: "Would adding battery storage reduce peak carbon intensity without increasing energy cost?",
    variables: [
      { id: "solar", label: "Solar capacity", role: "input", baseline: 48, unit: "MW", position: { x: 90, y: 76 } },
      { id: "demand", label: "Peak demand", role: "input", baseline: 82, unit: "MW", position: { x: 90, y: 204 } },
      { id: "storage", label: "Storage level", role: "mechanism", baseline: 35, unit: "%", position: { x: 330, y: 76 } },
      { id: "carbon", label: "Carbon intensity", role: "mechanism", baseline: 420, unit: "g/kWh", position: { x: 330, y: 204 } },
      { id: "cost", label: "Energy cost", role: "outcome", baseline: 96, unit: "$/MWh", position: { x: 610, y: 140 } },
    ],
    edges: [
      { from: "solar", to: "storage", weight: 0.6 },
      { from: "demand", to: "carbon", weight: 0.72 },
      { from: "storage", to: "carbon", weight: -0.58 },
      { from: "carbon", to: "cost", weight: 0.46 },
      { from: "demand", to: "cost", weight: 0.55 },
    ],
    interventions: [
      { label: "Add battery storage", target: "storage", delta: 20, summary: "Increase available storage level by 20 percentage points." },
      { label: "Expand solar capacity", target: "solar", delta: 18, summary: "Add 18 MW of solar generation capacity." },
      { label: "Shift peak demand", target: "demand", delta: -12, summary: "Move 12 MW of demand outside the peak window." },
      { label: "Charge at midday", target: "storage", delta: 12, summary: "Reserve additional midday generation for evening demand." },
      { label: "Community solar", target: "solar", delta: 10, summary: "Add 10 MW through distributed community generation." },
    ],
  },
  {
    id: "logistics",
    industry: "Logistics",
    title: "Fleet planning & delivery reliability",
    description: "Identify the operational levers that improve delivery promises while controlling fuel spend.",
    causalQuestion: "What would be the effect of adding fleet capacity on delivery time and customer satisfaction?",
    variables: [
      { id: "fleet", label: "Fleet capacity", role: "input", baseline: 76, unit: "vehicles", position: { x: 90, y: 76 } },
      { id: "fuel", label: "Fuel cost", role: "mechanism", baseline: 28, unit: "$k/week", position: { x: 90, y: 204 } },
      { id: "delivery", label: "Delivery time", role: "mechanism", baseline: 2.8, unit: "days", position: { x: 330, y: 76 } },
      { id: "ontime", label: "On-time rate", role: "mechanism", baseline: 88, unit: "%", position: { x: 330, y: 204 } },
      { id: "satisfaction", label: "Customer satisfaction", role: "outcome", baseline: 74, unit: "index", position: { x: 610, y: 140 } },
    ],
    edges: [
      { from: "fleet", to: "delivery", weight: -0.62 },
      { from: "fleet", to: "fuel", weight: 0.4 },
      { from: "delivery", to: "ontime", weight: -0.74 },
      { from: "ontime", to: "satisfaction", weight: 0.7 },
      { from: "fuel", to: "satisfaction", weight: -0.22 },
    ],
    interventions: [
      { label: "Add fleet capacity", target: "fleet", delta: 12, summary: "Add 12 vehicles to the active fleet." },
      { label: "Route optimization", target: "delivery", delta: -0.4, summary: "Reduce average delivery time by four-tenths of a day." },
      { label: "Consolidate shipments", target: "fuel", delta: -5, summary: "Lower weekly fuel cost by $5k through consolidation." },
      { label: "Regional depot", target: "fleet", delta: 8, summary: "Open a regional depot equivalent to eight vehicles of capacity." },
      { label: "Delivery promise buffer", target: "ontime", delta: 4, summary: "Improve on-time performance by four percentage points." },
    ],
  },
];

function formatValue(value: number, unit: string) {
  const precision = Math.abs(value) < 10 && !Number.isInteger(value) ? 1 : 0;
  return `${value.toFixed(precision)} ${unit}`;
}

function formatDelta(value: number, unit: string) {
  const sign = value > 0 ? "+" : "";
  const precision = Math.abs(value) < 10 && !Number.isInteger(value) ? 1 : 0;
  return `${sign}${value.toFixed(precision)} ${unit}`;
}

function simulateIntervention(application: Application, intervention: Intervention) {
  const deltas = Object.fromEntries(application.variables.map((variable) => [variable.id, 0])) as Record<string, number>;
  deltas[intervention.target] = intervention.delta;

  // Propagate the intervention through this small directed acyclic graph.
  for (let pass = 0; pass < application.variables.length; pass += 1) {
    application.edges.forEach((edge) => {
      deltas[edge.to] += deltas[edge.from] * edge.weight;
    });
  }

  return Object.fromEntries(
    application.variables.map((variable) => [variable.id, variable.baseline + deltas[variable.id]]),
  ) as Record<string, number>;
}

export default function Applications() {
  const [selectedId, setSelectedId] = useState(applications[0].id);
  const [interventionIndex, setInterventionIndex] = useState(0);
  const application = applications.find((item) => item.id === selectedId) ?? applications[0];
  const intervention = application.interventions[interventionIndex] ?? application.interventions[0];
  const simulatedValues = useMemo(
    () => simulateIntervention(application, intervention),
    [application, intervention],
  );

  const changeApplication = (id: string) => {
    setSelectedId(id);
    setInterventionIndex(0);
  };

  const outcome = application.variables.find((variable) => variable.role === "outcome");
  const outcomeDelta = outcome ? simulatedValues[outcome.id] - outcome.baseline : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm font-medium text-blue-700 transition-colors hover:text-purple-700 dark:text-blue-300 dark:hover:text-purple-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CAUS Lab
          </Link>

          <header className="mb-10 max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <Globe className="h-5 w-5" />
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 bg-white/70 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
              >
                Causal applications
              </Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-6xl">
              Causal models in the real world
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              Explore sample projects across five industries. Choose an application, inspect its causal graph, and run a simple intervention to see how changes propagate through the system.
            </p>
          </header>

          <section className="mb-8 grid gap-3 md:grid-cols-5">
            {applications.map((item) => {
              const isSelected = item.id === application.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => changeApplication(item.id)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-blue-400 bg-blue-600 text-white shadow-md dark:border-blue-500"
                      : "border-white/70 bg-white/75 text-gray-800 hover:border-blue-200 hover:bg-white dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-100 dark:hover:border-blue-800"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className={`block text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-blue-100" : "text-blue-600 dark:text-blue-300"}`}>
                    {item.industry}
                  </span>
                  <span className="mt-2 block font-bold">{item.title}</span>
                </button>
              );
            })}
          </section>

          <Card className="mb-8 border-blue-100 bg-white/85 shadow-sm backdrop-blur dark:border-blue-900/60 dark:bg-gray-900/80">
            <CardContent className="p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">
                    {application.industry} application
                  </p>
                  <h2 className="mb-3 text-2xl font-bold text-gray-950 dark:text-white md:text-3xl">{application.title}</h2>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">{application.description}</p>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/80 p-5 dark:border-purple-900/60 dark:bg-purple-950/30">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    <Lightbulb className="h-4 w-4" />
                    Causal question
                  </div>
                  <p className="text-lg font-semibold leading-relaxed text-purple-950 dark:text-purple-100">{application.causalQuestion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(310px,0.65fr)]">
            <Card className="overflow-hidden border-white/70 bg-white/85 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
              <CardHeader className="border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl text-gray-950 dark:text-white">
                      <Network className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      Causal diagram
                    </CardTitle>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Arrows show direction; weights show the modeled relationship strength.</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">Input</span>
                    <span className="rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-200">Mechanism</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Outcome</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto p-3 md:p-6">
                <svg viewBox="0 0 760 280" className="min-w-[680px] w-full" role="img" aria-label={`${application.title} causal diagram`}>
                  <defs>
                    <marker id="causal-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>
                  {application.edges.map((edge) => {
                    const from = application.variables.find((variable) => variable.id === edge.from);
                    const to = application.variables.find((variable) => variable.id === edge.to);
                    if (!from || !to) return null;
                    const labelX = (from.position.x + to.position.x) / 2;
                    const labelY = (from.position.y + to.position.y) / 2 - 8;
                    return (
                      <g key={`${edge.from}-${edge.to}`}>
                        <line
                          x1={from.position.x}
                          y1={from.position.y}
                          x2={to.position.x}
                          y2={to.position.y}
                          stroke={edge.weight < 0 ? "#ef4444" : "#64748b"}
                          strokeWidth="2.5"
                          markerEnd="url(#causal-arrow)"
                        />
                        <rect x={labelX - 22} y={labelY - 11} width="44" height="20" rx="10" fill="white" stroke="#e2e8f0" />
                        <text x={labelX} y={labelY + 3} textAnchor="middle" fontSize="11" fontWeight="700" fill={edge.weight < 0 ? "#dc2626" : "#475569"}>
                          {edge.weight > 0 ? "+" : ""}{edge.weight.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}
                  {application.variables.map((variable) => {
                    const value = simulatedValues[variable.id];
                    const colors = variable.role === "input"
                      ? { fill: "#eff6ff", stroke: "#93c5fd", text: "#1d4ed8" }
                      : variable.role === "mechanism"
                        ? { fill: "#faf5ff", stroke: "#d8b4fe", text: "#7e22ce" }
                        : { fill: "#ecfdf5", stroke: "#86efac", text: "#047857" };
                    return (
                      <g key={variable.id}>
                        <rect x={variable.position.x - 76} y={variable.position.y - 30} width="152" height="60" rx="12" fill={colors.fill} stroke={colors.stroke} strokeWidth="2" />
                        <text x={variable.position.x} y={variable.position.y - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill={colors.text}>
                          {variable.label}
                        </text>
                        <text x={variable.position.x} y={variable.position.y + 14} textAnchor="middle" fontSize="12" fontWeight="600" fill="#334155">
                          {formatValue(value, variable.unit)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                  Red arrows represent negative effects. The displayed values update after each intervention.
                </p>
              </CardContent>
            </Card>

            <Card className="h-fit border-purple-100 bg-white/85 shadow-sm backdrop-blur dark:border-purple-900/60 dark:bg-gray-900/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-950 dark:text-white">
                  <SlidersHorizontal className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  Run an intervention
                </CardTitle>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Choose one of five simple changes for this project to simulate how its effects travel through the graph.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {application.interventions.map((item, index) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => setInterventionIndex(index)}
                      aria-pressed={index === interventionIndex}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left transition-colors ${
                        index === interventionIndex
                          ? "border-purple-300 bg-purple-50 text-purple-900 dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-100"
                          : "border-gray-200 hover:border-purple-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-purple-800 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="pr-3 text-sm font-medium">{item.label}</span>
                      {index === interventionIndex ? <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-300" /> : <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />}
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50/70 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Selected intervention</p>
                  <p className="mt-1 font-semibold text-purple-950 dark:text-purple-100">{intervention.summary}</p>
                  <p className="mt-2 text-sm text-purple-800 dark:text-purple-200">
                    Direct change: {formatDelta(intervention.delta, application.variables.find((variable) => variable.id === intervention.target)?.unit ?? "index")}
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-4 w-full" onClick={() => setInterventionIndex(0)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to first intervention
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 border-white/70 bg-white/85 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
            <CardHeader>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <CardTitle className="text-xl text-gray-950 dark:text-white">Variable changes</CardTitle>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Baseline values compared with the simulated intervention.</p>
                </div>
                {outcome && (
                  <div className="rounded-lg bg-emerald-50 px-3 py-2 text-right dark:bg-emerald-950/40">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Outcome change</p>
                    <p className={`font-bold ${outcomeDelta >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>
                      {formatDelta(outcomeDelta, outcome.unit)}
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="px-3 py-3 font-semibold">Variable</th>
                    <th className="px-3 py-3 font-semibold">Role</th>
                    <th className="px-3 py-3 font-semibold">Baseline</th>
                    <th className="px-3 py-3 font-semibold">Change</th>
                    <th className="px-3 py-3 font-semibold">Simulated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {application.variables.map((variable) => {
                    const delta = simulatedValues[variable.id] - variable.baseline;
                    return (
                      <tr key={variable.id}>
                        <td className="px-3 py-4 font-semibold text-gray-900 dark:text-white">{variable.label}</td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            variable.role === "input"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                              : variable.role === "mechanism"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                          }`}>
                            {variable.role}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-gray-600 dark:text-gray-300">{formatValue(variable.baseline, variable.unit)}</td>
                        <td className={`px-3 py-4 font-semibold ${delta >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>
                          {formatDelta(delta, variable.unit)}
                        </td>
                        <td className="px-3 py-4 font-bold text-gray-900 dark:text-white">{formatValue(simulatedValues[variable.id], variable.unit)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Want to explore the vocabulary behind these diagrams?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/terminology">
                <Button variant="outline">Browse terminology</Button>
              </Link>
              <Link href="/workflow">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Open workflow
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