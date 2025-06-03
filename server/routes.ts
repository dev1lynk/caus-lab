import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { insertProjectSchema, insertUploadedDataSchema, type Variable, type CausalLink, type ProjectResults } from "@shared/schema";

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
        variableImpact: project.variables.reduce((acc, variable) => {
          acc[variable.name] = Math.random() * 80 + 20; // 20-100%
          return acc;
        }, {} as Record<string, number>),
        correlations: project.variables.reduce((acc, variable) => {
          acc[variable.name] = project.variables.reduce((inner, other) => {
            inner[other.name] = variable.id === other.id ? 1 : (Math.random() * 2 - 1);
            return inner;
          }, {} as Record<string, number>);
          return acc;
        }, {} as Record<string, Record<string, number>>),
        summary: `Based on your data analysis and causal model, the key insights show strong correlations between your variables. The model predicts continued growth with ${project.variables.length} variables analyzed over ${project.dataRows} data points.`,
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

  const httpServer = createServer(app);
  return httpServer;
}
