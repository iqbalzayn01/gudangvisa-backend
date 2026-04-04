import { DocumentRepository } from './documents.repository';
import { AppError } from '../../utils/AppError';

export class DocumentService {
  private documentRepo = new DocumentRepository();

  async createNewDoc(data: any, staffId: string, fileUrl?: string) {
    // Generate a unique tracking code (e.g., GVI-1712345678)
    const uniqueTrackingCode = `GVI-${Date.now()}`;

    const newDocumentData = {
      trackingCode: uniqueTrackingCode,
      clientName: data.clientName,
      docType: data.docType, // VISA, KITAS, or PASSPORT
      status: 'RECEIVED' as const,
      fileUrl: fileUrl || null,
      createdBy: staffId,
    };

    return await this.documentRepo.createDocumentWithHistory(newDocumentData);
  }

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
