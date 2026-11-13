import { experienceRepository } from '@/repositories/experience.repository';
import { ExperienceRecord, NewExperienceRecord } from '@/lib/db';
import { invalidatePortfolioCache } from '@/lib/cache/revalidate';

export class ExperienceService {
  async getAllExperience(): Promise<ExperienceRecord[]> {
    return experienceRepository.getAll();
  }

  async getExperienceById(id: number): Promise<ExperienceRecord | null> {
    return experienceRepository.getById(id);
  }

  async createExperience(data: Omit<NewExperienceRecord, 'id'>): Promise<ExperienceRecord> {
    const created = await experienceRepository.create(data);
    invalidatePortfolioCache();
    return created;
  }

  async updateExperience(id: number, data: Partial<NewExperienceRecord>): Promise<ExperienceRecord> {
    const updated = await experienceRepository.update(id, data);
    invalidatePortfolioCache();
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    const deleted = await experienceRepository.delete(id);
    if (deleted) {
      invalidatePortfolioCache();
    }
    return deleted;
  }
}

export const experienceService = new ExperienceService();
