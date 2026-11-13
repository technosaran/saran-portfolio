import { projectsRepository } from '@/repositories/projects.repository';
import { ProjectRecord, NewProjectRecord } from '@/lib/db';
import { invalidatePortfolioCache } from '@/lib/cache/revalidate';

export class ProjectsService {
  async getAllProjects(): Promise<ProjectRecord[]> {
    return projectsRepository.getAll();
  }

  async getProjectById(id: number): Promise<ProjectRecord | null> {
    return projectsRepository.getById(id);
  }

  async createProject(data: Omit<NewProjectRecord, 'id'>): Promise<ProjectRecord> {
    const created = await projectsRepository.create(data);
    invalidatePortfolioCache();
    return created;
  }

  async updateProject(id: number, data: Partial<NewProjectRecord>): Promise<ProjectRecord> {
    const updated = await projectsRepository.update(id, data);
    invalidatePortfolioCache();
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    const deleted = await projectsRepository.delete(id);
    if (deleted) {
      invalidatePortfolioCache();
    }
    return deleted;
  }
}

export const projectsService = new ProjectsService();
