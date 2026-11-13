import { certificatesRepository } from '@/repositories/certificates.repository';
import { CertificateRecord, NewCertificateRecord } from '@/lib/db';
import { invalidatePortfolioCache } from '@/lib/cache/revalidate';

export class CertificatesService {
  async getAllCertificates(): Promise<CertificateRecord[]> {
    return certificatesRepository.getAll();
  }

  async getCertificateById(id: number): Promise<CertificateRecord | null> {
    return certificatesRepository.getById(id);
  }

  async createCertificate(data: Omit<NewCertificateRecord, 'id'>): Promise<CertificateRecord> {
    const created = await certificatesRepository.create(data);
    invalidatePortfolioCache();
    return created;
  }

  async updateCertificate(id: number, data: Partial<NewCertificateRecord>): Promise<CertificateRecord> {
    const updated = await certificatesRepository.update(id, data);
    invalidatePortfolioCache();
    return updated;
  }

  async deleteCertificate(id: number): Promise<boolean> {
    const deleted = await certificatesRepository.delete(id);
    if (deleted) {
      invalidatePortfolioCache();
    }
    return deleted;
  }
}

export const certificatesService = new CertificatesService();
