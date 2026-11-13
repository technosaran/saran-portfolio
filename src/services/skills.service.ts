import { skillsRepository } from '@/repositories/skills.repository';
import { SkillRecord, NewSkillRecord } from '@/lib/db';
import { invalidatePortfolioCache } from '@/lib/cache/revalidate';

export class SkillsService {
  async getAllSkills(): Promise<SkillRecord[]> {
    return skillsRepository.getAll();
  }

  async getSkillById(id: number): Promise<SkillRecord | null> {
    return skillsRepository.getById(id);
  }

  async createSkill(data: Omit<NewSkillRecord, 'id'>): Promise<SkillRecord> {
    const created = await skillsRepository.create(data);
    invalidatePortfolioCache();
    return created;
  }

  async updateSkill(id: number, data: Partial<NewSkillRecord>): Promise<SkillRecord> {
    const updated = await skillsRepository.update(id, data);
    invalidatePortfolioCache();
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    const deleted = await skillsRepository.delete(id);
    if (deleted) {
      invalidatePortfolioCache();
    }
    return deleted;
  }
}

export const skillsService = new SkillsService();
