import type { Variable, CausalLink, ProjectResults } from "@shared/schema";

export interface SampleProject {
  id: string;
  name: string;
  description: string;
  industry: string;
  variables: Variable[];
  causalLinks: CausalLink[];
  sampleData: Record<string, any>[];
  results?: ProjectResults;
}

// Semiconductor Manufacturing Sample Project
export const semiconductorProject: SampleProject = {
  id: "semiconductor-fab",
  name: "Semiconductor Fab Production Optimization",
  description: "Analyze yield rates, defect rates, and production efficiency in semiconductor manufacturing",
  industry: "Semiconductor",
  variables: [
    {
      id: "yield-rate",
      name: "Yield Rate",
      type: "target",
      color: "#3b82f6",
      position: { x: 400, y: 100 },
      description: "Percentage of functional chips per wafer",
      unit: "%",
      category: "production"
    },
    {
      id: "wafer-temp",
      name: "Wafer Temperature",
      type: "input",
      color: "#10b981",
      position: { x: 100, y: 50 },
      description: "Processing temperature during fabrication",
      unit: "°C",
      category: "production"
    },
    {
      id: "chamber-pressure",
      name: "Chamber Pressure",
      type: "input",
      color: "#8b5cf6",
      position: { x: 100, y: 150 },
      description: "Vacuum pressure in processing chamber",
      unit: "mTorr",
      category: "production"
    },
    {
      id: "defect-density",
      name: "Defect Density",
      type: "mediator",
      color: "#f59e0b",
      position: { x: 250, y: 80 },
      description: "Number of defects per square centimeter",
      unit: "defects/cm²",
      category: "production"
    },
    {
      id: "contamination-level",
      name: "Contamination Level",
      type: "external",
      color: "#ef4444",
      position: { x: 100, y: 250 },
      description: "Particle contamination in cleanroom",
      unit: "particles/m³",
      category: "production"
    },
    {
      id: "equipment-uptime",
      name: "Equipment Uptime",
      type: "input",
      color: "#06b6d4",
      position: { x: 250, y: 200 },
      description: "Percentage of operational time",
      unit: "%",
      category: "production"
    },
    {
      id: "silicon-quality",
      name: "Silicon Wafer Quality",
      type: "input",
      color: "#84cc16",
      position: { x: 50, y: 350 },
      description: "Grade of silicon substrate",
      unit: "grade",
      category: "supply_chain"
    },
    {
      id: "cycle-time",
      name: "Process Cycle Time",
      type: "mediator",
      color: "#f97316",
      position: { x: 250, y: 300 },
      description: "Time to complete one processing cycle",
      unit: "hours",
      category: "production"
    }
  ],
  causalLinks: [
    { id: "link1", source: "wafer-temp", target: "defect-density", strength: 75 },
    { id: "link2", source: "chamber-pressure", target: "defect-density", strength: 65 },
    { id: "link3", source: "defect-density", target: "yield-rate", strength: 85 },
    { id: "link4", source: "contamination-level", target: "defect-density", strength: 70 },
    { id: "link5", source: "equipment-uptime", target: "cycle-time", strength: 60 },
    { id: "link6", source: "silicon-quality", target: "defect-density", strength: 55 },
    { id: "link7", source: "cycle-time", target: "yield-rate", strength: 45 }
  ],
  sampleData: [
    {
      Date: "2024-01-01",
      "Yield Rate": 94.2,
      "Wafer Temperature": 1050,
      "Chamber Pressure": 2.5,
      "Defect Density": 0.12,
      "Contamination Level": 15,
      "Equipment Uptime": 98.5,
      "Silicon Wafer Quality": "Prime",
      "Process Cycle Time": 4.2
    },
    {
      Date: "2024-01-02", 
      "Yield Rate": 93.8,
      "Wafer Temperature": 1055,
      "Chamber Pressure": 2.7,
      "Defect Density": 0.15,
      "Contamination Level": 18,
      "Equipment Uptime": 97.2,
      "Silicon Wafer Quality": "Prime",
      "Process Cycle Time": 4.4
    },
    {
      Date: "2024-01-03",
      "Yield Rate": 95.1,
      "Wafer Temperature": 1048,
      "Chamber Pressure": 2.3,
      "Defect Density": 0.09,
      "Contamination Level": 12,
      "Equipment Uptime": 99.1,
      "Silicon Wafer Quality": "Prime+",
      "Process Cycle Time": 4.0
    }
  ]
};

// Semiconductor Supply Chain Sample Project
export const supplyChainProject: SampleProject = {
  id: "semiconductor-supply",
  name: "Global Semiconductor Supply Chain",
  description: "Analyze supply chain disruptions, lead times, and inventory management",
  industry: "Semiconductor",
  variables: [
    {
      id: "delivery-time",
      name: "Lead Time",
      type: "target",
      color: "#3b82f6",
      position: { x: 500, y: 150 },
      description: "Time from order to delivery",
      unit: "weeks",
      category: "supply_chain"
    },
    {
      id: "raw-material-cost",
      name: "Raw Material Cost",
      type: "input",
      color: "#10b981",
      position: { x: 100, y: 100 },
      description: "Cost of silicon and rare earth materials",
      unit: "$/kg",
      category: "supply_chain"
    },
    {
      id: "shipping-delays",
      name: "Shipping Delays",
      type: "external",
      color: "#ef4444",
      position: { x: 100, y: 200 },
      description: "Port congestion and logistics delays",
      unit: "days",
      category: "supply_chain"
    },
    {
      id: "inventory-level",
      name: "Inventory Level", 
      type: "mediator",
      color: "#f59e0b",
      position: { x: 300, y: 120 },
      description: "Stock levels of critical components",
      unit: "months",
      category: "supply_chain"
    },
    {
      id: "supplier-reliability",
      name: "Supplier Reliability",
      type: "input",
      color: "#8b5cf6",
      position: { x: 100, y: 300 },
      description: "On-time delivery rate from suppliers",
      unit: "%",
      category: "supply_chain"
    },
    {
      id: "geopolitical-risk",
      name: "Geopolitical Risk",
      type: "external",
      color: "#dc2626",
      position: { x: 100, y: 400 },
      description: "Trade restrictions and policy changes",
      unit: "risk_score",
      category: "supply_chain"
    },
    {
      id: "demand-forecast",
      name: "Demand Forecast",
      type: "input",
      color: "#06b6d4",
      position: { x: 300, y: 250 },
      description: "Predicted market demand",
      unit: "units/month",
      category: "market"
    }
  ],
  causalLinks: [
    { id: "link1", source: "raw-material-cost", target: "inventory-level", strength: 60 },
    { id: "link2", source: "shipping-delays", target: "delivery-time", strength: 80 },
    { id: "link3", source: "inventory-level", target: "delivery-time", strength: 70 },
    { id: "link4", source: "supplier-reliability", target: "delivery-time", strength: 75 },
    { id: "link5", source: "geopolitical-risk", target: "shipping-delays", strength: 65 },
    { id: "link6", source: "demand-forecast", target: "inventory-level", strength: 55 }
  ],
  sampleData: [
    {
      Date: "2024-01-01",
      "Lead Time": 12.5,
      "Raw Material Cost": 850,
      "Shipping Delays": 3.2,
      "Inventory Level": 2.1,
      "Supplier Reliability": 94.5,
      "Geopolitical Risk": 3.2,
      "Demand Forecast": 125000
    },
    {
      Date: "2024-01-02",
      "Lead Time": 13.1,
      "Raw Material Cost": 870,
      "Shipping Delays": 4.1,
      "Inventory Level": 1.9,
      "Supplier Reliability": 92.8,
      "Geopolitical Risk": 3.8,
      "Demand Forecast": 128000
    }
  ]
};

// Chip Design Performance Sample Project
export const chipDesignProject: SampleProject = {
  id: "chip-design",
  name: "Advanced Chip Design Performance",
  description: "Optimize chip architecture for performance, power consumption, and area efficiency",
  industry: "Semiconductor",
  variables: [
    {
      id: "performance-score",
      name: "Performance Score",
      type: "target",
      color: "#3b82f6",
      position: { x: 600, y: 200 },
      description: "Benchmark performance rating",
      unit: "GFLOPS",
      category: "technology"
    },
    {
      id: "transistor-density",
      name: "Transistor Density",
      type: "input",
      color: "#10b981",
      position: { x: 100, y: 150 },
      description: "Number of transistors per square mm",
      unit: "M/mm²",
      category: "technology"
    },
    {
      id: "power-consumption",
      name: "Power Consumption",
      type: "mediator",
      color: "#f59e0b",
      position: { x: 350, y: 100 },
      description: "Total power draw under load",
      unit: "watts",
      category: "technology"
    },
    {
      id: "clock-frequency",
      name: "Clock Frequency",
      type: "input",
      color: "#8b5cf6",
      position: { x: 100, y: 250 },
      description: "Operating frequency of the processor",
      unit: "GHz",
      category: "technology"
    },
    {
      id: "cache-size",
      name: "Cache Size",
      type: "input",
      color: "#06b6d4",
      position: { x: 100, y: 350 },
      description: "Size of on-chip cache memory",
      unit: "MB",
      category: "technology"
    },
    {
      id: "thermal-design",
      name: "Thermal Design",
      type: "mediator",
      color: "#ef4444",
      position: { x: 350, y: 300 },
      description: "Heat dissipation efficiency",
      unit: "°C/W",
      category: "technology"
    },
    {
      id: "manufacturing-cost",
      name: "Manufacturing Cost",
      type: "external",
      color: "#84cc16",
      position: { x: 100, y: 450 },
      description: "Cost per chip to manufacture",
      unit: "$/unit",
      category: "financial"
    }
  ],
  causalLinks: [
    { id: "link1", source: "transistor-density", target: "performance-score", strength: 85 },
    { id: "link2", source: "clock-frequency", target: "performance-score", strength: 90 },
    { id: "link3", source: "clock-frequency", target: "power-consumption", strength: 75 },
    { id: "link4", source: "cache-size", target: "performance-score", strength: 65 },
    { id: "link5", source: "power-consumption", target: "thermal-design", strength: 80 },
    { id: "link6", source: "transistor-density", target: "manufacturing-cost", strength: 70 }
  ],
  sampleData: [
    {
      Date: "2024-01-01",
      "Performance Score": 1450,
      "Transistor Density": 95.2,
      "Power Consumption": 125,
      "Clock Frequency": 3.8,
      "Cache Size": 64,
      "Thermal Design": 0.85,
      "Manufacturing Cost": 245
    }
  ]
};

// Stock Price Prediction Sample Project
export const stockPredictionProject: SampleProject = {
  id: "semiconductor-stock-prediction",
  name: "Semiconductor Stock Price Prediction",
  description: "Predict future stock prices using 16 key semiconductor industry variables including supply chain, market demand, and financial indicators",
  industry: "Semiconductor",
  variables: [
    {
      id: "st-stock-price",
      name: "ST Stock Price",
      type: "target",
      color: "#3b82f6",
      position: { x: 600, y: 200 },
      description: "STMicroelectronics stock price (target variable)",
      unit: "USD",
      category: "financial"
    },
    {
      id: "st-orders-shipment",
      name: "ST Orders Shipment",
      type: "input",
      color: "#10b981",
      position: { x: 100, y: 50 },
      description: "Volume of orders and shipments",
      unit: "units",
      category: "production"
    },
    {
      id: "crude-oil-price",
      name: "Crude Oil Price",
      type: "external",
      color: "#ef4444",
      position: { x: 100, y: 100 },
      description: "Global crude oil price indicator",
      unit: "USD/barrel",
      category: "market"
    },
    {
      id: "asml-stock-price",
      name: "ASML Stock Price",
      type: "input",
      color: "#8b5cf6",
      position: { x: 100, y: 150 },
      description: "ASML Holdings stock price (equipment supplier)",
      unit: "USD",
      category: "financial"
    },
    {
      id: "interest-rate",
      name: "Interest Rate",
      type: "external",
      color: "#f59e0b",
      position: { x: 100, y: 200 },
      description: "Central bank interest rates",
      unit: "%",
      category: "financial"
    },
    {
      id: "nasdaq-soxx",
      name: "NASDAQ/SOXX",
      type: "input",
      color: "#06b6d4",
      position: { x: 100, y: 250 },
      description: "Semiconductor sector index",
      unit: "index",
      category: "market"
    },
    {
      id: "global-chip-demand",
      name: "Global Chip Demand Index",
      type: "input",
      color: "#84cc16",
      position: { x: 100, y: 300 },
      description: "Global semiconductor demand indicator",
      unit: "index",
      category: "market"
    },
    {
      id: "st-export-data",
      name: "ST Export Data",
      type: "input",
      color: "#f97316",
      position: { x: 250, y: 50 },
      description: "Export volume and revenue data",
      unit: "USD millions",
      category: "financial"
    },
    {
      id: "st-inventory",
      name: "ST Inventory",
      type: "mediator",
      color: "#ec4899",
      position: { x: 250, y: 100 },
      description: "Inventory levels and turnover",
      unit: "units",
      category: "production"
    },
    {
      id: "st-forecast",
      name: "ST Forecast",
      type: "mediator",
      color: "#6366f1",
      position: { x: 250, y: 150 },
      description: "Company's internal forecasts",
      unit: "growth_%",
      category: "financial"
    },
    {
      id: "st-eps",
      name: "ST EPS",
      type: "mediator",
      color: "#14b8a6",
      position: { x: 250, y: 200 },
      description: "Earnings per share",
      unit: "USD",
      category: "financial"
    },
    {
      id: "st-forward-pe",
      name: "ST Forward P/E",
      type: "mediator",
      color: "#f43f5e",
      position: { x: 250, y: 250 },
      description: "Forward price-to-earnings ratio",
      unit: "ratio",
      category: "financial"
    },
    {
      id: "ti-stock-price",
      name: "TI Stock Price",
      type: "input",
      color: "#8b5cf6",
      position: { x: 250, y: 300 },
      description: "Texas Instruments stock price",
      unit: "USD",
      category: "financial"
    },
    {
      id: "infineon-stock-price",
      name: "Infineon Stock Price",
      type: "input",
      color: "#06b6d4",
      position: { x: 400, y: 50 },
      description: "Infineon Technologies stock price",
      unit: "EUR",
      category: "financial"
    },
    {
      id: "st-revenues",
      name: "ST Revenues",
      type: "input",
      color: "#84cc16",
      position: { x: 400, y: 100 },
      description: "Quarterly revenue figures",
      unit: "USD millions",
      category: "financial"
    },
    {
      id: "infineon-shipments",
      name: "Infineon Shipments",
      type: "input",
      color: "#f97316",
      position: { x: 400, y: 150 },
      description: "Infineon's shipment volumes",
      unit: "units",
      category: "production"
    }
  ],
  causalLinks: [
    { id: "link1", source: "st-orders-shipment", target: "st-revenues", strength: 85 },
    { id: "link2", source: "st-revenues", target: "st-eps", strength: 80 },
    { id: "link3", source: "st-eps", target: "st-stock-price", strength: 90 },
    { id: "link4", source: "nasdaq-soxx", target: "st-stock-price", strength: 75 },
    { id: "link5", source: "global-chip-demand", target: "st-orders-shipment", strength: 70 },
    { id: "link6", source: "asml-stock-price", target: "st-stock-price", strength: 65 },
    { id: "link7", source: "interest-rate", target: "st-forward-pe", strength: 60 },
    { id: "link8", source: "st-forward-pe", target: "st-stock-price", strength: 55 },
    { id: "link9", source: "crude-oil-price", target: "global-chip-demand", strength: 45 },
    { id: "link10", source: "st-inventory", target: "st-forecast", strength: 50 },
    { id: "link11", source: "st-forecast", target: "st-stock-price", strength: 40 },
    { id: "link12", source: "ti-stock-price", target: "st-stock-price", strength: 35 },
    { id: "link13", source: "infineon-stock-price", target: "st-stock-price", strength: 30 },
    { id: "link14", source: "infineon-shipments", target: "global-chip-demand", strength: 25 }
  ],
  sampleData: [
    {
      Date: "2024-01-01",
      "ST Stock Price": 42.15,
      "ST Orders Shipment": 125000,
      "Crude Oil Price": 78.50,
      "ASML Stock Price": 652.30,
      "Interest Rate": 4.25,
      "NASDAQ/SOXX": 285.40,
      "Global Chip Demand Index": 118.5,
      "ST Export Data": 3250,
      "ST Inventory": 85000,
      "ST Forecast": 8.5,
      "ST EPS": 2.45,
      "ST Forward P/E": 17.2,
      "TI Stock Price": 168.75,
      "Infineon Stock Price": 32.80,
      "ST Revenues": 4250,
      "Infineon Shipments": 95000
    },
    {
      Date: "2024-01-02",
      "ST Stock Price": 41.95,
      "ST Orders Shipment": 122000,
      "Crude Oil Price": 79.20,
      "ASML Stock Price": 648.90,
      "Interest Rate": 4.25,
      "NASDAQ/SOXX": 283.10,
      "Global Chip Demand Index": 117.8,
      "ST Export Data": 3180,
      "ST Inventory": 87000,
      "ST Forecast": 8.2,
      "ST EPS": 2.42,
      "ST Forward P/E": 17.3,
      "TI Stock Price": 167.20,
      "Infineon Stock Price": 32.45,
      "ST Revenues": 4180,
      "Infineon Shipments": 93000
    },
    {
      Date: "2024-01-03",
      "ST Stock Price": 43.25,
      "ST Orders Shipment": 128000,
      "Crude Oil Price": 77.80,
      "ASML Stock Price": 658.40,
      "Interest Rate": 4.20,
      "NASDAQ/SOXX": 287.90,
      "Global Chip Demand Index": 119.2,
      "ST Export Data": 3320,
      "ST Inventory": 83000,
      "ST Forecast": 8.8,
      "ST EPS": 2.48,
      "ST Forward P/E": 17.4,
      "TI Stock Price": 170.15,
      "Infineon Stock Price": 33.10,
      "ST Revenues": 4320,
      "Infineon Shipments": 97000
    }
  ]
};

export const sampleProjects = [
  semiconductorProject,
  supplyChainProject,
  chipDesignProject,
  stockPredictionProject
];