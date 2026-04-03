import { DocumentRepository } from './document.repository';
import { AppError } from '../../utils/AppError';

export class DocumentService {
  private documentRepo = new DocumentRepository();

  async trackDocument(trackingCode: string) {
    const document = await this.documentRepo.findByTrackingCode(trackingCode);
    if (!document) {
      throw new AppError(
        404,
        'Dokumen tidak ditemukan. Periksa kembali nomor resi Anda.',
      );
    }
    return document;
  }

  async updateDocumentProgress(
    documentId: string,
    status: any,
    notes: string,
    staffId: string,
  ) {
    // Validasi tambahan bisa dilakukan di sini
    return await this.documentRepo.updateStatusWithHistory(
      documentId,
      status,
      notes,
      staffId,
    );
  }
}
