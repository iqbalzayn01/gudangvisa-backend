import { TrackingRepository } from './tracking.repository.js';
import { AppError } from '../../utils/AppError.js';
import { createSignedDownloadUrl } from '../../utils/storage.js';

export class TrackingService {
  private repository = new TrackingRepository();

  async getTrackingDetails(trackingCode: string) {
    const document = await this.repository.findByTrackingCode(trackingCode);
    if (!document) throw new AppError(404, 'Document not found');

    // Generate a temporary signed download URL for the attached file
    const fileDownloadUrl = await createSignedDownloadUrl(document.fileUrl);

    return {
      ...document,
      fileDownloadUrl,
    };
  }

  async processDocumentUpdate(
    documentId: string,
    status: 'RECEIVED' | 'IN_REVIEW' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'COMPLETED',
    notes: string,
    staffId: string,
  ) {
    return await this.repository.updateStatusWithLog(
      documentId,
      status,
      notes,
      staffId,
    );
  }
}
