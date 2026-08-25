import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { insertProjectSchema, insertUploadedDataSchema, type Variable, type CausalLink, type ProjectResults } from "@shared/schema";
import { SemiconductorTNCMVAE, predefinedScenarios } from "./huggingface-service";
import { yahooFinanceService } from "./yahoo-finance-service";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize Hugging Face T-NCM-VAE model
  let tncmModel: SemiconductorTNCMVAE | null = null;
  try {
    tncmModel = new SemiconductorTNCMVAE(process.env.HF_TOKEN);
    console.log("T-NCM-VAE model initialized successfully");
  } catch (error) {
    console.warn("T-NCM-VAE model initialization failed:", error);
  }
  
  // Create a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error getting project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload CSV data
  app.post("/api/projects/:id/upload", upload.single('csvFile'), async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Parse CSV data
      const csvText = req.file.buffer.toString('utf-8');
      const lines = csvText.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        return res.status(400).json({ message: "Empty CSV file" });
      }

      if (lines.length > 2001) { // Header + 2000 rows
        return res.status(400).json({ message: "CSV file exceeds 2000 rows limit" });
      }

      // Parse header and data
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      if (headers.length > 5) {
        return res.status(400).json({ message: "Free plan allows maximum 5 variables" });
      }

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, any> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Store uploaded data
      const uploadedData = await storage.createUploadedData({
        projectId,
        filename: req.file.originalname,
        data,
      });

      // Update project with data info and auto-generate variables
      const variables: Variable[] = headers.map((header, index) => ({
        id: `var-${index}`,
        name: header,
        type: index === 0 ? 'target' : 'input',
        color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5],
        position: { x: 100 + (index * 120), y: 100 + (index % 2) * 100 }
      }));

      await storage.updateProject(projectId, {
        dataRows: data.length,
        variables,
        status: 'diagram'
      });

      res.json({ 
        success: true, 
        dataRows: data.length, 
        variables: headers,
        uploadedData 
      });

    } catch (error) {
      console.error("Error uploading data:", error);
      res.status(500).json({ message: "Error processing file upload" });
    }
  });

  // Update project variables
  app.put("/api/projects/:id/variables", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const variables = z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['target', 'input', 'mediator', 'external']),
        color: z.string(),
        position: z.object({ x: z.number(), y: z.number() }).optional()
      })).parse(req.body);

      await storage.updateProjectVariables(projectId, variables);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating variables:", error);
      res.status(400).json({ message: "Invalid variable data" });
    }
  });

  // Update causal links
  app.put("/api/projects/:id/causal-links", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const links = z.array(z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
        strength: z.number().min(0).max(100)
      })).parse(req.body);

      await storage.updateProjectCausalLinks(projectId, links);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating causal links:", error);
      res.status(400).json({ message: "Invalid causal link data" });
    }
  });

  // Train model (mocked for MVP)
  app.post("/api/projects/:id/train", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Simulate training delay
      setTimeout(async () => {
        const trainedModel = {
          accuracy: 0.873,
          modelType: "Time Series + Causal",
          trainedAt: new Date().toISOString(),
          parameters: {
            epochs: 100,
            learningRate: 0.001,
            batchSize: 32
          }
        };

        await storage.updateProject(projectId, {
          trainedModel,
          status: 'complete'
        });
      }, 2000);

      await storage.updateProjectStatus(projectId, 'training');
      res.json({ success: true, message: "Training started" });

    } catch (error) {
      console.error("Error starting training:", error);
      res.status(500).json({ message: "Error starting model training" });
    }
  });

  // Generate results (mocked for MVP)
  app.post("/api/projects/:id/generate-results", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Generate mock results based on variables
      const results: ProjectResults = {
        forecast: {
          values: Array.from({ length: 30 }, (_, i) => 125000 + Math.random() * 20000 + i * 1000),
          dates: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
          }),
          confidence: {
            upper: Array.from({ length: 30 }, (_, i) => 135000 + Math.random() * 15000 + i * 1000),
            lower: Array.from({ length: 30 }, (_, i) => 115000 + Math.random() * 15000 + i * 1000)
          }
        },
        variableImpact: project.variables?.reduce((acc, variable) => {
          acc[variable.name] = Math.random() * 80 + 20; // 20-100%
          return acc;
        }, {} as Record<string, number>) || {},
        correlations: project.variables?.reduce((acc, variable) => {
          acc[variable.name] = project.variables?.reduce((inner, other) => {
            inner[other.name] = variable.id === other.id ? 1 : (Math.random() * 2 - 1);
            return inner;
          }, {} as Record<string, number>) || {};
          return acc;
        }, {} as Record<string, Record<string, number>>) || {},
        summary: `Based on your data analysis and causal model, the key insights show strong correlations between your variables. The model predicts continued growth with ${project.variables?.length || 0} variables analyzed over ${project.dataRows} data points.`,
        metrics: {
          revenueForcast: "+$127K",
          modelAccuracy: 87.3,
          causalStrength: 0.76
        }
      };

      await storage.updateProjectResults(projectId, results);
      res.json(results);

    } catch (error) {
      console.error("Error generating results:", error);
      res.status(500).json({ message: "Error generating results" });
    }
  });

  // Get project data for visualization
  app.get("/api/projects/:id/data", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const uploadedData = await storage.getUploadedData(projectId);
      
      if (!uploadedData) {
        return res.status(404).json({ message: "No data found for project" });
      }

      res.json(uploadedData.data);
    } catch (error) {
      console.error("Error getting project data:", error);
      res.status(500).json({ message: "Error retrieving project data" });
    }
  });

  // Hugging Face T-NCM-VAE API endpoints

  // Generate counterfactual scenario
  app.post("/api/counterfactual", async (req, res) => {
    try {
      if (!tncmModel) {
        return res.status(503).json({ 
          status: "error", 
          message: "T-NCM-VAE model not available. Please configure HF_TOKEN environment variable." 
        });
      }

      const { input_data, intervention_variable, intervention_value, intervention_time, scenario_name } = req.body;

      if (!input_data || !intervention_variable || intervention_value === undefined || intervention_time === undefined) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: input_data, intervention_variable, intervention_value, intervention_time"
        });
      }

      const result = await tncmModel.generateCounterfactual({
        input_data,
        intervention_variable,
        intervention_value,
        intervention_time,
        scenario_name: scenario_name || "Custom Scenario"
      });

      res.json(result);

    } catch (error) {
      console.error("Error generating counterfactual:", error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  // Get model information and predefined scenarios
  app.get("/api/model-info", async (req, res) => {
    try {
      if (!tncmModel) {
        return res.status(503).json({ 
          message: "T-NCM-VAE model not available" 
        });
      }

      const modelInfo = tncmModel.getModelInfo();
      res.json(modelInfo);

    } catch (error) {
      console.error("Error getting model info:", error);
      res.status(500).json({ message: "Error retrieving model information" });
    }
  });

  // Get predefined scenarios
  app.get("/api/predefined-scenarios", async (req, res) => {
    try {
      res.json({
        scenarios: predefinedScenarios
      });
    } catch (error) {
      console.error("Error getting predefined scenarios:", error);
      res.status(500).json({ message: "Error retrieving scenarios" });
    }
  });

  // Generate sample data for testing
  app.get("/api/sample-data", async (req, res) => {
    try {
      if (!tncmModel) {
        return res.status(503).json({ 
          message: "T-NCM-VAE model not available" 
        });
      }

      const sampleData = tncmModel.generateSampleData();
      const modelInfo = tncmModel.getModelInfo();
      
      res.json({
        data: sampleData,
        variable_names: modelInfo.variables,
        shape: [20, 15],
        description: "20 time steps × 15 semiconductor variables"
      });

    } catch (error) {
      console.error("Error generating sample data:", error);
      res.status(500).json({ message: "Error generating sample data" });
    }
  });

  // Yahoo Finance API endpoints for ST stock data

  // Get current STM stock price
  app.get("/api/stock/current", async (req, res) => {
    try {
      const stockData = await yahooFinanceService.getCurrentPrice('STM');
      res.json(stockData);
    } catch (error) {
      console.error("Error fetching current stock price:", error);
      res.status(500).json({ message: "Failed to fetch current stock price" });
    }
  });

  // Get historical STM stock data
  app.get("/api/stock/historical/:period", async (req, res) => {
    try {
      const period = req.params.period;
      const historicalData = await yahooFinanceService.getHistoricalData('STM', period);
      res.json(historicalData);
    } catch (error) {
      console.error("Error fetching historical stock data:", error);
      res.status(500).json({ message: "Failed to fetch historical stock data" });
    }
  });

  // Get market insights for specific timeframe
  app.get("/api/stock/insights/:period", async (req, res) => {
    try {
      const period = req.params.period;
      const insights = await yahooFinanceService.getMarketInsights('STM', period);
      res.json(insights);
    } catch (error) {
      console.error("Error generating market insights:", error);
      res.status(500).json({ message: "Failed to generate market insights" });
    }
  });

  // Generate stock prediction with timeframe
  app.post("/api/stock/predict", async (req, res) => {
    try {
      const { timeframe, variables } = req.body;
      
      // Get current market data for context
      const [currentPrice, historicalData, insights] = await Promise.all([
        yahooFinanceService.getCurrentPrice('STM'),
        yahooFinanceService.getHistoricalData('STM', timeframe || '30d'),
        yahooFinanceService.getMarketInsights('STM', timeframe || '30d')
      ]);

      // Generate prediction based on timeframe
      const daysMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90, '6m': 180 };
      const days = daysMap[timeframe as keyof typeof daysMap] || 30;
      
      const currentPriceValue = currentPrice.price;
      const baseVolatility = insights.volatility / 100;
      
      // Generate predictions starting from June 10th (when T-NCM-VAE model data ends)
      const predictions = [];
      const june10 = new Date('2025-06-10');
      const today = new Date();
      
      // Generate dynamic predictions starting from June 10th up to current date + future
      const startDate = new Date('2025-06-10');
      const currentDate = new Date();
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + days);
      
      // Calculate total days to generate (from June 10 to end date)
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < totalDays; i++) {
        const predictionDate = new Date(startDate);
        predictionDate.setDate(startDate.getDate() + i);
        
        // Skip if prediction date is in the past before June 10
        if (predictionDate < startDate) continue;
        
        const daysSinceStart = i;
        const randomWalk = (Math.random() - 0.5) * baseVolatility * 0.03;
        const trendFactor = insights.trend === 'bullish' ? 0.001 : insights.trend === 'bearish' ? -0.001 : 0;
        
        // Use current price as baseline for more accurate predictions
        const basePrice = currentPriceValue;
        const timeDecay = Math.exp(-daysSinceStart * 0.01); // Gradual decay in prediction accuracy
        const price = basePrice * (1 + (randomWalk + trendFactor) * timeDecay * (daysSinceStart * 0.05 + 1));
        
        predictions.push({
          date: predictionDate.toISOString().split('T')[0],
          price: Math.max(price, basePrice * 0.7), // Prevent unrealistic drops
          confidence: {
            upper: price * (1 + baseVolatility * 0.1 * (1 + daysSinceStart * 0.01)),
            lower: price * (1 - baseVolatility * 0.1 * (1 + daysSinceStart * 0.01))
          }
        });
      }

      const response = {
        timeframe,
        currentPrice: currentPriceValue,
        predictions,
        historicalData: historicalData.slice(-30), // Last 30 days for chart
        insights,
        executiveSummary: {
          outlook: insights.trend === 'bullish' ? 'Positive' : insights.trend === 'bearish' ? 'Negative' : 'Neutral',
          keyDrivers: [
            `Current trend: ${insights.trend}`,
            `Volatility: ${insights.volatility.toFixed(1)}%`,
            `RSI: ${insights.technicalIndicators.rsi?.toFixed(1) || 'N/A'}`
          ],
          marketSentiment: insights.marketSentiment,
          recommendation: generateRecommendation(insights)
        }
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating stock prediction:", error);
      res.status(500).json({ message: "Failed to generate stock prediction" });
    }
  });

  // Enhanced stock prediction with variable adjustments
  app.post('/api/stock/predict-with-variables', async (req: Request, res: Response) => {
    try {
      const { variables, timeframe } = req.body;

      if (!tncmModel) {
        res.status(503).json({ message: "Prediction model is unavailable" });
        return;
      }
      
      // Get current market data
      const [currentPrice, insights] = await Promise.all([
        yahooFinanceService.getCurrentPrice('STM'),
        yahooFinanceService.getMarketInsights('STM', timeframe || '30d')
      ]);
      
      // Prepare variable data for T-NCM-VAE model
      const inputData = variables.map((v: any) => v.currentValue);
      
      // Generate counterfactual prediction using T-NCM-VAE model
      const counterfactualResult = await tncmModel.generateCounterfactual({
        input_data: [inputData],
        intervention_variable: 'stm_stock_price',
        intervention_value: variables.find((v: any) => v.name === 'stm_stock_price')?.currentValue || currentPrice.price,
        intervention_time: 0,
        scenario_name: 'Variable_Adjustment_Prediction'
      });
      
      // Generate enhanced predictions incorporating variable changes
      const daysMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90, '6m': 180 };
      const days = daysMap[timeframe as keyof typeof daysMap] || 30;
      
      const predictions = [];
      const basePrice = counterfactualResult.counterfactual_series?.[0]?.[4] || currentPrice.price;
      
      // Generate predictions from June 10th with variable-adjusted baseline
      for (let i = 0; i < days; i++) {
        const predictionDate = new Date('2025-06-10');
        predictionDate.setDate(predictionDate.getDate() + i);
        
        const variableInfluence = inputData.reduce((acc: number, value: number, index: number) => {
          // Weight different variables differently based on their importance
          const weights = [0.15, 0.12, 0.10, 0.08, 0.20, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.02, 0.03, 0.05];
          return acc + (value * weights[index]);
        }, 0);
        
        const timeDecay = Math.exp(-i * 0.01);
        const price = basePrice * (1 + (variableInfluence - 0.5) * timeDecay * 0.1);
        
        predictions.push({
          date: predictionDate.toISOString().split('T')[0],
          price: Math.max(price, basePrice * 0.7),
          confidence: {
            upper: price * 1.15,
            lower: price * 0.85
          }
        });
      }
      
      res.json({
        timeframe,
        currentPrice: currentPrice.price,
        adjustedBasePrice: basePrice,
        predictions,
        counterfactualResult,
        variableImpact: inputData.map((value: number, index: number) => ({
          index,
          value,
          impact: (value - 0.5) * 100
        }))
      });
      
    } catch (error) {
      console.error('Variable-based prediction error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to generate variable-based prediction'
      });
    }
  });

  function generateRecommendation(insights: any): string {
    if (insights.trend === 'bullish' && insights.technicalIndicators.rsi < 70) {
      return 'Consider buying - positive momentum with room for growth';
    } else if (insights.trend === 'bearish' && insights.technicalIndicators.rsi > 30) {
      return 'Consider selling - negative momentum detected';
    } else if (insights.technicalIndicators.rsi > 70) {
      return 'Hold - potentially overbought, watch for pullback';
    } else if (insights.technicalIndicators.rsi < 30) {
      return 'Consider buying - potentially oversold opportunity';
    }
    return 'Hold - mixed signals, monitor closely';
  }

  const httpServer = createServer(app);
  return httpServer;
}
