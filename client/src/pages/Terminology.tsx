import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Term = {
  name: string;
  category: string;
  short: string;
  definition: string;
  intuition: string;
  example: string;
};

const terms: Term[] = [
  {
    name: "Causal inference",
    category: "Foundations",
    short: "Learning what changes when we intervene.",
    definition: "Causal inference is the process of using data, assumptions, and research design to estimate how an outcome would change if we actively changed an exposure or treatment.",
    intuition: "It answers “what would happen if?” rather than only describing what happened together.",
    example: "Estimating whether a new onboarding program causes customers to stay longer, not just whether program users have higher retention.",
  },
  {
    name: "Causal question",
    category: "Foundations",
    short: "A precise question about the effect of an action.",
    definition: "A causal question specifies an intervention, the population receiving it, the outcome of interest, and the time horizon over which the effect is measured.",
    intuition: "Good causal analysis starts by turning a vague business question into a comparison between clear possible worlds.",
    example: "What is the six-month effect of offering a 10% discount on repeat purchases among first-time buyers?",
  },
  {
    name: "Causal effect",
    category: "Foundations",
    short: "The change in an outcome caused by a treatment.",
    definition: "A causal effect is the difference between an outcome under one treatment condition and the outcome that would have occurred under another condition for the same unit or population.",
    intuition: "The effect is the gap between two potential realities, even though we can usually observe only one of them.",
    example: "The causal effect of a notification is the additional number of weekly sessions caused by sending it.",
  },
  {
    name: "Treatment",
    category: "Foundations",
    short: "The exposure or action whose effect is being studied.",
    definition: "Treatment is the variable representing an intervention, exposure, policy, or condition that may change an outcome. It can be binary, categorical, continuous, or time-varying.",
    intuition: "Treatment is not limited to medicine; it is any controllable or meaningful “lever” in the causal question.",
    example: "Ad spend, a product feature flag, a loan approval, or a patient’s dose can each be a treatment.",
  },
  {
    name: "Outcome",
    category: "Foundations",
    short: "The response or result affected by treatment.",
    definition: "The outcome is the measured variable used to evaluate the consequence of a treatment or intervention.",
    intuition: "Define the outcome and its measurement window before analyzing the treatment effect.",
    example: "Revenue in the next 30 days, time to churn, blood pressure after eight weeks, or a conversion indicator.",
  },
  {
    name: "Unit",
    category: "Foundations",
    short: "The person, customer, location, or object being studied.",
    definition: "A unit is an entity that can receive a treatment and have an outcome, such as an individual, household, store, account, or country.",
    intuition: "Causal claims always apply to some defined set of units; changing that set changes the question.",
    example: "Each customer account is a unit when evaluating whether a new pricing page changes upgrades.",
  },
  {
    name: "Potential outcome",
    category: "Foundations",
    short: "An outcome a unit would have under a treatment.",
    definition: "A potential outcome is the outcome that a unit would experience under a particular treatment level. Potential outcomes are also called counterfactual outcomes.",
    intuition: "For each unit there is a potential outcome for each possible action, but only the outcome under the received action is observed.",
    example: "Y(1) is a customer’s retention if shown the new flow; Y(0) is retention if shown the old flow.",
  },
  {
    name: "Counterfactual",
    category: "Foundations",
    short: "The unobserved alternative outcome.",
    definition: "A counterfactual is a hypothetical outcome for a unit under a treatment condition different from the one actually received.",
    intuition: "Causal inference is difficult because the counterfactual is missing for every treated or untreated unit.",
    example: "For a customer who received a discount, their counterfactual is how much they would have purchased without it.",
  },
  {
    name: "Average treatment effect (ATE)",
    category: "Effects & estimands",
    short: "The average effect across the target population.",
    definition: "ATE is the population average of the difference between the potential outcome under treatment and the potential outcome under control: E[Y(1) − Y(0)].",
    intuition: "It describes the expected impact if everyone in the target population were assigned treatment instead of control.",
    example: "The average change in 90-day retention if the entire eligible customer population received a feature.",
  },
  {
    name: "Average treatment effect on the treated (ATT)",
    category: "Effects & estimands",
    short: "The average effect among those who received treatment.",
    definition: "ATT is the average difference between treated units’ treated potential outcomes and their untreated potential outcomes: E[Y(1) − Y(0) | T=1].",
    intuition: "ATT answers how much the people who actually received the intervention benefited from it.",
    example: "The incremental revenue generated among customers who were already enrolled in a loyalty program.",
  },
  {
    name: "Conditional average treatment effect (CATE)",
    category: "Effects & estimands",
    short: "The average effect for a subgroup.",
    definition: "CATE is the expected treatment effect conditional on observed characteristics, such as age, region, prior behavior, or risk level.",
    intuition: "CATE reveals who benefits most or least, supporting personalization and targeting.",
    example: "The effect of a retention offer for customers with high versus low prior engagement.",
  },
  {
    name: "Heterogeneous treatment effect",
    category: "Effects & estimands",
    short: "When treatment effects differ across units.",
    definition: "Treatment effect heterogeneity occurs when the causal effect is not the same for every unit or subgroup.",
    intuition: "A positive average effect can hide groups that are unaffected or harmed.",
    example: "A faster checkout increases purchases for mobile users but has no effect on desktop users.",
  },
  {
    name: "Confounder",
    category: "Bias & structure",
    short: "A common cause of treatment and outcome.",
    definition: "A confounder is a variable that causally influences both the treatment and the outcome, creating a non-causal association if it is not appropriately handled.",
    intuition: "Confounders make treated and untreated groups different before treatment, so their outcomes are not a fair comparison.",
    example: "Customer intent can influence both ad exposure and purchase probability.",
  },
  {
    name: "Confounding",
    category: "Bias & structure",
    short: "Mixing a target effect with other causal pathways.",
    definition: "Confounding is distortion of a causal estimate caused by shared causes of the treatment and outcome that have not been blocked or accounted for.",
    intuition: "The observed difference combines the treatment effect with pre-existing differences between groups.",
    example: "A simple comparison may overstate the effect of training because motivated employees are more likely to enroll.",
  },
  {
    name: "Selection bias",
    category: "Bias & structure",
    short: "Bias from who enters or remains in the analysis.",
    definition: "Selection bias occurs when inclusion, treatment assignment, follow-up, or missingness depends on variables related to treatment and outcome in a way that breaks comparability.",
    intuition: "The analyzed sample can become a distorted slice of the population or a collider-created subgroup.",
    example: "Measuring a treatment only among customers who respond to a survey can produce a biased effect estimate.",
  },
  {
    name: "Collider",
    category: "Bias & structure",
    short: "A variable caused by two other variables.",
    definition: "A collider is a node on a path where two arrows point into it. Conditioning on a collider, or one of its descendants, can create a spurious association.",
    intuition: "Adjusting for every available variable is unsafe: controlling for a collider can open a path that was previously closed.",
    example: "Both skill and connections can cause hiring; conditioning on being hired can make skill and connections appear negatively related.",
  },
  {
    name: "Mediator",
    category: "Bias & structure",
    short: "A variable on the pathway from treatment to outcome.",
    definition: "A mediator is a post-treatment variable through which some or all of a treatment’s effect operates.",
    intuition: "Adjusting for a mediator can remove part of the total effect, so it should not be controlled for when estimating the total effect.",
    example: "A coaching program may improve performance partly through increased practice; practice is a mediator.",
  },
  {
    name: "Directed acyclic graph (DAG)",
    category: "Graphs & interventions",
    short: "A map of assumed causal relationships.",
    definition: "A DAG is a graph whose arrows encode assumed direct causal relationships and whose directed paths contain no cycles.",
    intuition: "A DAG makes assumptions visible and helps identify which variables to adjust for before modeling.",
    example: "A graph can represent how price and competitor price affect demand while seasonality affects both price and demand.",
  },
  {
    name: "Node",
    category: "Graphs & interventions",
    short: "A variable or concept in a causal graph.",
    definition: "A node represents a measured or unmeasured variable, treatment, outcome, or other concept in a causal model.",
    intuition: "Nodes are the nouns of a causal story; arrows describe the verbs connecting them.",
    example: "Marketing spend, website visits, and revenue can each be nodes in a growth DAG.",
  },
  {
    name: "Edge",
    category: "Graphs & interventions",
    short: "A directed causal link between two nodes.",
    definition: "An edge is an arrow from one node to another representing an assumed direct causal effect, such as X → Y.",
    intuition: "An edge claims that changing its source can directly change its target, holding the rest of the graph’s relevant causes fixed.",
    example: "A link from delivery time to customer satisfaction represents a direct causal hypothesis.",
  },
  {
    name: "Intervention",
    category: "Graphs & interventions",
    short: "An intentional change to a treatment variable.",
    definition: "An intervention sets or changes a variable through an external action, breaking the variable’s usual incoming causal mechanisms.",
    intuition: "Interventions describe actions or policies, not merely observations of naturally occurring values.",
    example: "Setting a product’s price to $20 for all eligible users is an intervention on price.",
  },
  {
    name: "do-operator",
    category: "Graphs & interventions",
    short: "Notation for forcing a variable to a value.",
    definition: "The do-operator, written do(X=x), denotes the distribution of outcomes when X is externally set to x rather than observed at x.",
    intuition: "P(Y | X=x) describes seeing X; P(Y | do(X=x)) describes making X happen. They are equal only under suitable conditions.",
    example: "P(renewal | do(discount=10%)) is the renewal probability after actively assigning the discount.",
  },
  {
    name: "Backdoor path",
    category: "Graphs & interventions",
    short: "A non-causal path entering treatment from behind.",
    definition: "A backdoor path from treatment X to outcome Y begins with an arrow pointing into X. It can transmit confounding association.",
    intuition: "Closing every open backdoor path is the graph-based goal of covariate adjustment for a total effect.",
    example: "Intent → Ad exposure ← Budget rules can create a backdoor route between ad exposure and purchase through intent.",
  },
  {
    name: "Backdoor criterion",
    category: "Identification",
    short: "A rule for choosing adjustment variables.",
    definition: "A set of variables satisfies the backdoor criterion for estimating X’s effect on Y when it blocks all backdoor paths and contains no descendants of X.",
    intuition: "It provides a principled alternative to choosing controls based only on correlation or predictive power.",
    example: "Adjusting for prior intent and season, but not post-treatment clicks, can identify an ad effect in a suitable DAG.",
  },
  {
    name: "Identification",
    category: "Identification",
    short: "Determining whether data can reveal a causal estimand.",
    definition: "A causal effect is identified when the observed-data distribution, together with stated assumptions and design, uniquely determines the desired causal quantity.",
    intuition: "Identification comes before estimation: no algorithm can recover an effect that the available information cannot distinguish.",
    example: "A randomized experiment identifies the ATE without needing to model all common causes of treatment and outcome.",
  },
  {
    name: "Exchangeability",
    category: "Assumptions",
    short: "No unmeasured differences after conditioning.",
    definition: "Conditional exchangeability means potential outcomes are independent of treatment after conditioning on a sufficient set of covariates: Y(x) ⟂ X | Z.",
    intuition: "Within strata of Z, treatment assignment is as-if random with respect to the outcomes we would have seen.",
    example: "After accounting for measured risk factors, treated and untreated patients are assumed comparable in expected untreated outcomes.",
  },
  {
    name: "Positivity",
    category: "Assumptions",
    short: "Every relevant group can receive every treatment.",
    definition: "Positivity, or overlap, requires that each unit or covariate profile has a nonzero probability of receiving each treatment level being compared.",
    intuition: "You cannot learn the effect of a treatment in a group that never receives it.",
    example: "If no small businesses ever receive the premium plan, the premium plan’s effect for them is not supported by the data.",
  },
  {
    name: "SUTVA",
    category: "Assumptions",
    short: "Stable treatment versions and no interference.",
    definition: "The Stable Unit Treatment Value Assumption says treatment has a single well-defined version and one unit’s treatment does not change another unit’s outcome.",
    intuition: "It lets us describe each unit’s potential outcome using its own treatment, without hidden versions or spillovers.",
    example: "A social-media intervention may violate no-interference because one user’s exposure can influence their friends.",
  },
  {
    name: "Randomized experiment",
    category: "Designs",
    short: "Assignment by chance to create comparability.",
    definition: "A randomized experiment assigns treatment independently of potential outcomes, making treatment and control comparable in expectation.",
    intuition: "Randomization breaks the link between pre-treatment characteristics and assignment, reducing confounding by design.",
    example: "Randomly showing half of eligible visitors a new checkout flow estimates its causal conversion effect.",
  },
  {
    name: "Observational study",
    category: "Designs",
    short: "A study where treatment is not assigned by the analyst.",
    definition: "An observational study uses data on naturally occurring treatment choices or exposures rather than controlled assignment.",
    intuition: "Observational data can answer causal questions, but only with credible assumptions, design, and adjustment.",
    example: "Comparing outcomes of customers who independently opted into a loyalty program.",
  },
  {
    name: "Instrumental variable (IV)",
    category: "Identification",
    short: "An outside source of treatment variation.",
    definition: "An instrumental variable affects treatment assignment, has no direct effect on the outcome, and shares no unblocked common cause with the outcome except through treatment.",
    intuition: "An IV can mimic randomization when treatment is confounded, though its assumptions are demanding.",
    example: "Random variation in advisor assignment may instrument participation in a voluntary coaching program.",
  },
  {
    name: "Difference-in-differences",
    category: "Estimation",
    short: "Comparing changes over time between groups.",
    definition: "Difference-in-differences estimates an effect by subtracting the pre-to-post change in a comparison group from the pre-to-post change in a treated group.",
    intuition: "It removes stable group differences and common time shocks when the parallel-trends assumption is credible.",
    example: "Compare sales changes in a region adopting a tax with sales changes in similar regions that did not.",
  },
  {
    name: "Propensity score",
    category: "Estimation",
    short: "The probability of treatment given covariates.",
    definition: "The propensity score is the conditional probability of receiving treatment given observed pre-treatment covariates.",
    intuition: "Balancing units on this score can balance measured confounders, but it cannot fix unmeasured confounding.",
    example: "Match customers with similar predicted offer-acceptance probabilities before comparing retention.",
  },
  {
    name: "Causal forest",
    category: "Estimation",
    short: "A tree ensemble for heterogeneous effects.",
    definition: "A causal forest is a machine-learning estimator that partitions the feature space to estimate how treatment effects vary across units.",
    intuition: "It focuses on differences in effects rather than only predicting outcomes accurately.",
    example: "Find which customer segments are most likely to respond to a retention incentive.",
  },
  {
    name: "Sensitivity analysis",
    category: "Robustness",
    short: "Testing how conclusions change under weaker assumptions.",
    definition: "Sensitivity analysis quantifies how strong an unmeasured confounder or other violation would need to be to change the conclusion.",
    intuition: "A result is more credible when plausible hidden bias would not overturn it.",
    example: "Estimate how large an omitted variable’s association with treatment and churn must be to erase the observed effect.",
  },
];

const categories = ["All", ...Array.from(new Set(terms.map((term) => term.category)))];

export default function Terminology() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedName, setSelectedName] = useState(terms[0].name);

  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return terms.filter((term) => {
      const matchesCategory = activeCategory === "All" || term.category === activeCategory;
      const searchable = `${term.name} ${term.short} ${term.definition} ${term.example}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const selectedTerm = terms.find((term) => term.name === selectedName) ?? filteredTerms[0];

  const selectTerm = (name: string) => {
    setSelectedName(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />
      <main className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-blue-700 transition-colors hover:text-purple-700 dark:text-blue-300 dark:hover:text-purple-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CAUS Lab
          </Link>

          <header className="mb-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="border-blue-200 bg-white/70 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                Causal inference glossary
              </Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-950 dark:text-white md:text-5xl">
              The language of cause and effect
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Explore the concepts behind causal models. Select a term to see its definition, intuition, and a practical example.
            </p>
          </header>

          <section className="mb-6 rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search terms, definitions, or examples..."
                aria-label="Search terminology"
                className="h-11 border-gray-200 bg-white pl-10 pr-10 dark:border-gray-700 dark:bg-gray-950"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Terminology categories">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className="shrink-0"
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.4fr)]">
            <section aria-label="Terms" className="rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
              <div className="flex items-center justify-between px-3 pb-3 pt-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Explore terms</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{filteredTerms.length} of {terms.length}</span>
              </div>
              <div className="max-h-[620px] space-y-1 overflow-y-auto pr-1">
                {filteredTerms.length > 0 ? (
                  filteredTerms.map((term) => {
                    const isSelected = selectedTerm?.name === term.name;
                    return (
                      <button
                        type="button"
                        key={term.name}
                        onClick={() => selectTerm(term.name)}
                        aria-pressed={isSelected}
                        className={`group flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? "border-blue-300 bg-blue-50 shadow-sm dark:border-blue-700 dark:bg-blue-950/60"
                            : "border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800/80"
                        }`}
                      >
                        <span className="min-w-0 pr-3">
                          <span className={`block truncate text-sm font-semibold ${isSelected ? "text-blue-800 dark:text-blue-200" : "text-gray-800 dark:text-gray-100"}`}>
                            {term.name}
                          </span>
                          <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">{term.category}</span>
                        </span>
                        {isSelected ? (
                          <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 dark:text-gray-600" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-10 text-center">
                    <p className="font-medium text-gray-800 dark:text-gray-100">No terms found</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try a different search or category.</p>
                  </div>
                )}
              </div>
            </section>

            <Card className="h-fit overflow-hidden border-white/70 bg-white/85 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
              {selectedTerm ? (
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-300">{selectedTerm.category}</p>
                      <h2 className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">{selectedTerm.name}</h2>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-200">Term {terms.indexOf(selectedTerm) + 1}</Badge>
                  </div>
                  <p className="mb-8 text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-200">{selectedTerm.short}</p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Definition</h3>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">{selectedTerm.definition}</p>
                    </div>
                    <div className="rounded-xl border border-purple-100 bg-purple-50/80 p-4 dark:border-purple-900/60 dark:bg-purple-950/30">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Intuition</h3>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">{selectedTerm.intuition}</p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">In practice</h3>
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300">{selectedTerm.example}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Select another term to continue exploring.</p>
                    <Link href="/workflow">
                      <Button variant="outline" size="sm">Open workflow <ChevronRight className="ml-1 h-4 w-4" /></Button>
                    </Link>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex min-h-[400px] items-center justify-center p-8 text-center">
                  <div>
                    <BookOpen className="mx-auto mb-3 h-8 w-8 text-blue-500" />
                    <p className="font-medium text-gray-900 dark:text-white">Choose a term to begin</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}