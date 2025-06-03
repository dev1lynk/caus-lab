import { users, type User, type InsertUser, projects, type Project, type InsertProject, uploadedData, type UploadedData, type InsertUploadedData, type Variable, type CausalLink, type ProjectResults } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Data upload methods
  createUploadedData(data: InsertUploadedData): Promise<UploadedData>;
  getUploadedData(projectId: number): Promise<UploadedData | undefined>;
  
  // Project workflow methods
  updateProjectVariables(projectId: number, variables: Variable[]): Promise<void>;
  updateProjectCausalLinks(projectId: number, links: CausalLink[]): Promise<void>;
  updateProjectStatus(projectId: number, status: string): Promise<void>;
  updateProjectResults(projectId: number, results: ProjectResults): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private uploadedData: Map<number, UploadedData>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentDataId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.uploadedData = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentDataId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      expiresAt,
    };
    
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async createUploadedData(insertData: InsertUploadedData): Promise<UploadedData> {
    const id = this.currentDataId++;
    const data: UploadedData = {
      ...insertData,
      id,
      uploadedAt: new Date(),
    };
    
    this.uploadedData.set(id, data);
    return data;
  }

  async getUploadedData(projectId: number): Promise<UploadedData | undefined> {
    return Array.from(this.uploadedData.values()).find(
      (data) => data.projectId === projectId
    );
  }

  async updateProjectVariables(projectId: number, variables: Variable[]): Promise<void> {
    const project = this.projects.get(projectId);
    if (project) {
      project.variables = variables;
      this.projects.set(projectId, project);
    }
  }

  async updateProjectCausalLinks(projectId: number, links: CausalLink[]): Promise<void> {
    const project = this.projects.get(projectId);
    if (project) {
      project.causalLinks = links;
      this.projects.set(projectId, project);
    }
  }

  async updateProjectStatus(projectId: number, status: string): Promise<void> {
    const project = this.projects.get(projectId);
    if (project) {
      project.status = status;
      this.projects.set(projectId, project);
    }
  }

  async updateProjectResults(projectId: number, results: ProjectResults): Promise<void> {
    const project = this.projects.get(projectId);
    if (project) {
      project.results = results;
      this.projects.set(projectId, project);
    }
  }
}

export const storage = new MemStorage();
