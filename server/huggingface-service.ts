import { HfInference } from "@huggingface/inference";

interface CounterfactualRequest {
  input_data: number[][];
  intervention_variable: string;
  intervention_value: number;
  intervention_time: number;
  scenario_name: string;
}

interface CounterfactualResult {
  status: "success" | "error";
  scenario_name?: string;
  original_series?: number[][];
  counterfactual_series?: number[][];
  variable_names?: string[];
  intervention?: {
    variable: string;
    value: number;
    time: number;
  };
  message?: string;
}

export class SemiconductorTNCMVAE {
  private modelId = "thummd/semiconductor-tncm-vae";
  private hf: HfInference;
  private variableNames = [
    "stm_operational_regime",
    "stm_cumulative_shipments",
    "stm_7day_momentum",
    "stm_days_since_shipment",
    "stm_stock_price",
    "ti_stock_price",
    "infineon_stock_price",
    "nasdaq_index",
    "soxx_etf",
    "oil_price",
    "interest_rate",
    "eur_usd_rate",
    "stm_forecast_step",
    "stm_forecast_regime",
    "market_volatility",
  ];

  constructor(token?: string) {
    const hfToken = token || process.env.HF_TOKEN;
    if (!hfToken) {
      throw new Error("Hugging Face token is required");
    }
    this.hf = new HfInference(hfToken);
  }

  async generateCounterfactual(
    request: CounterfactualRequest,
  ): Promise<CounterfactualResult> {
    try {
      // Validate input data format
      if (
        !Array.isArray(request.input_data) ||
        request.input_data.length !== 20
      ) {
        throw new Error(
          "Input data must be a 20x15 array (20 time steps, 15 variables)",
        );
      }

      if (
        !request.input_data.every(
          (row) => Array.isArray(row) && row.length === 15,
        )
      ) {
        throw new Error("Each time step must have exactly 15 variables");
      }

      // Validate intervention variable
      if (!this.variableNames.includes(request.intervention_variable)) {
        throw new Error(
          `Invalid intervention variable. Must be one of: ${this.variableNames.join(", ")}`,
        );
      }

      // Validate intervention time
      if (request.intervention_time < 0 || request.intervention_time >= 20) {
        throw new Error("Intervention time must be between 0 and 19");
      }

      // For now, we'll simulate the counterfactual generation since the actual model
      // would require Python integration. In production, this would call the HF model.
      const counterfactual = this.simulateCounterfactual(
        request.input_data,
        request.intervention_variable,
        request.intervention_value,
        request.intervention_time,
      );

      return {
        status: "success",
        scenario_name: request.scenario_name,
        original_series: request.input_data,
        counterfactual_series: counterfactual,
        variable_names: this.variableNames,
        intervention: {
          variable: request.intervention_variable,
          value: request.intervention_value,
          time: request.intervention_time,
        },
      };
    } catch (error) {
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private simulateCounterfactual(
    inputData: number[][],
    interventionVariable: string,
    interventionValue: number,
    interventionTime: number,
  ): number[][] {
    // Create a deep copy of the input data
    const counterfactual = inputData.map((row) => [...row]);

    // Find the variable index
    const variableIndex = this.variableNames.indexOf(interventionVariable);

    // Apply intervention and propagate effects
    for (let t = interventionTime; t < 20; t++) {
      // Apply direct intervention
      counterfactual[t][variableIndex] += interventionValue;

      // Simulate causal effects on related variables
      this.applyCausalEffects(
        counterfactual[t],
        interventionVariable,
        interventionValue,
        t - interventionTime,
      );
    }

    return counterfactual;
  }

  private applyCausalEffects(
    timeStep: number[],
    interventionVariable: string,
    interventionValue: number,
    timeSinceIntervention: number,
  ) {
    // Define causal relationships between semiconductor variables
    const causalRelationships: Record<
      string,
      Array<{ target: string; coefficient: number }>
    > = {
      oil_price: [
        { target: "stm_stock_price", coefficient: -0.3 },
        { target: "market_volatility", coefficient: 0.4 },
      ],
      interest_rate: [
        { target: "stm_stock_price", coefficient: -0.5 },
        { target: "nasdaq_index", coefficient: -0.4 },
        { target: "soxx_etf", coefficient: -0.4 },
      ],
      nasdaq_index: [
        { target: "stm_stock_price", coefficient: 0.7 },
        { target: "ti_stock_price", coefficient: 0.6 },
        { target: "infineon_stock_price", coefficient: 0.6 },
      ],
      stm_operational_regime: [
        { target: "stm_cumulative_shipments", coefficient: 0.8 },
        { target: "stm_7day_momentum", coefficient: 0.6 },
        { target: "stm_stock_price", coefficient: 0.4 },
      ],
    };

    const effects = causalRelationships[interventionVariable];
    if (!effects) return;

    // Apply decay factor based on time since intervention
    const decayFactor = Math.exp(-0.1 * timeSinceIntervention);

    effects.forEach((effect) => {
      const targetIndex = this.variableNames.indexOf(effect.target);
      if (targetIndex !== -1) {
        const impact = interventionValue * effect.coefficient * decayFactor;
        timeStep[targetIndex] += impact;
      }
    });
  }

  getModelInfo() {
    return {
      model_id: this.modelId,
      variables: this.variableNames,
      input_dim: 15,
      seq_len: 20,
      predefined_scenarios: [
        {
          name: "STM Operational Boost",
          description: "What if STM increased operational activity?",
          intervention_variable: "stm_operational_regime",
          intervention_value: 2.0,
          intervention_time: 10,
        },
        {
          name: "Oil Price Shock",
          description: "What if oil prices dropped significantly?",
          intervention_variable: "oil_price",
          intervention_value: -1.5,
          intervention_time: 8,
        },
        {
          name: "Interest Rate Cut",
          description: "What if interest rates were reduced?",
          intervention_variable: "interest_rate",
          intervention_value: -1.0,
          intervention_time: 5,
        },
        {
          name: "Market Rally",
          description: "What if NASDAQ surged?",
          intervention_variable: "nasdaq_index",
          intervention_value: 2.0,
          intervention_time: 7,
        },
      ],
    };
  }

  // Generate sample data for testing
  generateSampleData(): number[][] {
    const data: number[][] = [];

    for (let t = 0; t < 20; t++) {
      const row: number[] = [];

      for (let v = 0; v < 15; v++) {
        // Generate realistic time series data with trends
        const trend = 0.1 * t;
        const noise = (Math.random() - 0.5) * 0.5;
        const baseValue = Math.sin(t * 0.3) + trend + noise;
        row.push(parseFloat(baseValue.toFixed(4)));
      }

      data.push(row);
    }

    return data;
  }
}

export const predefinedScenarios = [
  {
    name: "STM Operational Boost",
    description: "Increase STM operational activity to maximum level",
    intervention_variable: "stm_operational_regime",
    intervention_value: 2.0,
    intervention_time: 10,
    category: "operational",
  },
  {
    name: "Oil Price Shock",
    description: "Significant drop in oil prices affecting supply chains",
    intervention_variable: "oil_price",
    intervention_value: -1.5,
    intervention_time: 8,
    category: "market",
  },
  {
    name: "Interest Rate Cut",
    description: "Central bank reduces interest rates",
    intervention_variable: "interest_rate",
    intervention_value: -1.0,
    intervention_time: 5,
    category: "monetary",
  },
  {
    name: "Market Rally",
    description: "Strong NASDAQ performance boosts tech stocks",
    intervention_variable: "nasdaq_index",
    intervention_value: 2.0,
    intervention_time: 7,
    category: "market",
  },
  {
    name: "Supply Chain Optimization",
    description: "Improved shipment efficiency and momentum",
    intervention_variable: "stm_7day_momentum",
    intervention_value: 1.5,
    intervention_time: 6,
    category: "operational",
  },
];
