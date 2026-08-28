import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  BookOpen,
  ChevronRight,
  Globe,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import "./CausalFoundationHero.css";

type Scenario = {
  id: string;
  label: string;
  description: string;
  treatment: string;
  mediator: string;
  outcome: string;
  signal: string;
};

const scenarios: Scenario[] = [
  {
    id: "pricing",
    label: "Pricing intervention",
    description: "Trace a pricing change through demand and margin.",
    treatment: "Price change",
    mediator: "Demand",
    outcome: "Margin",
    signal: "+12.4% expected lift",
  },
  {
    id: "retention",
    label: "Retention program",
    description: "Separate the program effect from seasonal noise.",
    treatment: "Retention offer",
    mediator: "Engagement",
    outcome: "Renewal",
    signal: "+8.7% expected lift",
  },
  {
    id: "supply",
    label: "Supply disruption",
    description: "Stress-test the downstream cost of a constrained input.",
    treatment: "Lead-time shock",
    mediator: "Availability",
    outcome: "Service level",
    signal: "−5.1% expected shift",
  },
];

type GraphNodeProps = {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  kind: "intervention" | "treatment" | "mediator" | "outcome" | "context";
  selected: boolean;
  onSelect: () => void;
};

function GraphNode({
  x,
  y,
  width,
  label,
  detail,
  kind,
  selected,
  onSelect,
}: GraphNodeProps) {
  const isMint = kind === "intervention";
  const fill =
    kind === "treatment"
      ? "url(#treatmentFill)"
      : kind === "mediator"
        ? "url(#mediatorFill)"
        : kind === "outcome"
          ? "url(#outcomeFill)"
          : kind === "intervention"
            ? "url(#interventionFill)"
            : "url(#contextFill)";

  return (
    <g
      className={`causal-node${selected ? " causal-node--selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${detail}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      transform={`translate(${x} ${y})`}
    >
      <rect
        className={`causal-node__halo${isMint ? " causal-node__halo--mint" : ""}`}
        x={-8}
        y={-8}
        width={width + 16}
        height={76}
        rx={16}
      />
      <rect
        className="causal-node__body"
        width={width}
        height={60}
        rx={12}
        fill={fill}
      />
      <text className="causal-node__label" x={width / 2} y={26}>
        {label}
      </text>
      <text className="causal-node__detail" x={width / 2} y={44}>
        {detail}
      </text>
    </g>
  );
}

export default function CausalFoundationHero() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [selectedNode, setSelectedNode] = useState("Treatment");
  const scenario = scenarios[activeScenario];

  return (
    <section className="causal-hero" aria-labelledby="causal-hero-title">
      <div className="causal-hero__inner">
        <div className="causal-hero__copy">
          <div className="causal-hero__eyebrow">CAUS Lab / Foundation model</div>
          <h1 id="causal-hero-title" className="causal-hero__title">
            Welcome to <em>CAUS Lab</em>
          </h1>
          <h2 className="causal-hero__tagline">Unlock the Power of Generative Scenario Simulation</h2>
          <p className="causal-hero__subtitle">
            Step into a new era of decision-making with CAUS Lab, the generative AI platform that
            empowers you to explore, simulate, and analyze complex time-series scenarios—no matter
            your industry or use case.
          </p>
          <div className="causal-hero__actions">
            <Link href="/ask" className="causal-hero__ask">
              Ask Anything
              <HelpCircle size={17} aria-hidden="true" />
            </Link>
            <Link href="/causal-foundation-model" className="causal-hero__secondary">
              What Is a Causal Foundation Model?
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <nav className="causal-hero__links" aria-label="CAUS Lab resources">
            <Link href="/terminology">
              <BookOpen size={14} aria-hidden="true" />
              Terminology
            </Link>
            <Link href="/our-service">
              <BriefcaseBusiness size={14} aria-hidden="true" />
              Our Service
            </Link>
            <Link href="/applications">
              <Globe size={14} aria-hidden="true" />
              Applications
            </Link>
          </nav>
          <div className="causal-hero__note">
            <span aria-hidden="true" />
            Counterfactual reasoning, made inspectable
          </div>
        </div>

        <div
          className="causal-graph"
          aria-label="Interactive causal graph showing how interventions flow through treatment and mediator variables to an outcome"
        >
          <div className="causal-graph__topbar">
            <span className="causal-graph__status">Live causal graph</span>
            <span className="causal-graph__code">cfm / 04.17</span>
          </div>
          <div className="causal-graph__canvas">
            <svg
              viewBox="0 0 760 455"
              role="img"
              aria-labelledby="causal-graph-title causal-graph-desc"
            >
              <title id="causal-graph-title">Causal foundation model graph</title>
              <desc id="causal-graph-desc">
                An intervention changes a treatment. The treatment affects a mediator, which
                changes the outcome. Context variables help the model test alternative scenarios.
              </desc>
              <defs>
                <linearGradient id="treatmentFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#385bb9" />
                  <stop offset="1" stopColor="#273d83" />
                </linearGradient>
                <linearGradient id="mediatorFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7758ca" />
                  <stop offset="1" stopColor="#4a3a91" />
                </linearGradient>
                <linearGradient id="outcomeFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#9474df" />
                  <stop offset="1" stopColor="#5f4cb0" />
                </linearGradient>
                <linearGradient id="interventionFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2f857e" />
                  <stop offset="1" stopColor="#205b69" />
                </linearGradient>
                <linearGradient id="contextFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2b3b67" />
                  <stop offset="1" stopColor="#202d50" />
                </linearGradient>
                <marker
                  id="causalArrow"
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#91a5e3" />
                </marker>
                <marker
                  id="mintArrow"
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#78e5cf" />
                </marker>
              </defs>

              <path
                className="causal-edge causal-edge--intervention"
                d="M 146 114 C 164 145, 170 176, 181 211"
                markerEnd="url(#mintArrow)"
              />
              <path
                className="causal-edge causal-edge--primary"
                d="M 276 240 C 328 214, 354 190, 390 166"
                markerEnd="url(#causalArrow)"
              />
              <path
                className="causal-edge causal-edge--primary"
                d="M 500 166 C 543 188, 570 216, 600 240"
                markerEnd="url(#causalArrow)"
              />
              <path
                className="causal-edge"
                d="M 275 253 C 386 295, 497 293, 600 253"
                markerEnd="url(#causalArrow)"
              />
              <path
                className="causal-edge causal-edge--context"
                d="M 422 353 C 476 333, 526 300, 577 273"
                markerEnd="url(#causalArrow)"
              />

              <circle className="causal-edge__signal causal-edge__signal--mint" cx="169" cy="174" r="4" />
              <circle className="causal-edge__signal" cx="344" cy="200" r="3.5" />
              <circle className="causal-edge__signal" cx="551" cy="204" r="3.5" />

              <text x="103" y="174" fill="#6f82b3" fontSize="10" fontFamily="Space Mono, monospace">
                do()
              </text>
              <text x="328" y="323" fill="#6578ad" fontSize="10" fontFamily="Space Mono, monospace">
                adjust(context)
              </text>

              <GraphNode
                x={64}
                y={54}
                width={164}
                label="INTERVENTION"
                detail="a decision to test"
                kind="intervention"
                selected={selectedNode === "Intervention"}
                onSelect={() => setSelectedNode("Intervention")}
              />
              <GraphNode
                x={146}
                y={211}
                width={130}
                label="TREATMENT"
                detail={scenario.treatment}
                kind="treatment"
                selected={selectedNode === "Treatment"}
                onSelect={() => setSelectedNode("Treatment")}
              />
              <GraphNode
                x={390}
                y={136}
                width={110}
                label="MEDIATOR"
                detail={scenario.mediator}
                kind="mediator"
                selected={selectedNode === "Mediator"}
                onSelect={() => setSelectedNode("Mediator")}
              />
              <GraphNode
                x={600}
                y={211}
                width={112}
                label="OUTCOME"
                detail={scenario.outcome}
                kind="outcome"
                selected={selectedNode === "Outcome"}
                onSelect={() => setSelectedNode("Outcome")}
              />
              <GraphNode
                x={324}
                y={350}
                width={116}
                label="CONTEXT"
                detail="the world around it"
                kind="context"
                selected={selectedNode === "Context"}
                onSelect={() => setSelectedNode("Context")}
              />
            </svg>
          </div>
          <div className="causal-graph__caption">
            <span>
              <strong>{selectedNode}</strong> is inspectable at every step.
            </span>
            <span>select a node to follow its role</span>
          </div>
          <div className="causal-scenarios" aria-label="Choose a scenario">
            {scenarios.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`causal-scenario${activeScenario === index ? " causal-scenario--active" : ""}`}
                aria-pressed={activeScenario === index}
                onClick={() => setActiveScenario(index)}
              >
                <span className="causal-scenario__index">SCENARIO 0{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="causal-graph__insight" aria-live="polite">
            <div className="causal-graph__insight-mark" aria-hidden="true">
              <BrainCircuit size={15} />
            </div>
            <div>
              <strong>{scenario.signal}</strong> · {scenario.description}
            </div>
            <ChevronRight size={15} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}