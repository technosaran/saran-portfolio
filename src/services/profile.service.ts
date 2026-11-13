import { profileRepository } from '@/repositories/profile.repository';
import { ProfileRecord, NewProfileRecord } from '@/lib/db';
import { invalidatePortfolioCache } from '@/lib/cache/revalidate';

export class ProfileService {
  async getProfile(): Promise<ProfileRecord | null> {
    return profileRepository.getProfile();
  }

  async updateProfile(data: Partial<NewProfileRecord>): Promise<ProfileRecord> {
    const updated = await profileRepository.updateProfile(data);
    invalidatePortfolioCache();
    return updated;
  }
}

export const profileService = new ProfileService();
