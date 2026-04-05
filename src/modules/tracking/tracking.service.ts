import { TrackingRepository } from './tracking.repository.js';

export class TrackingService {
  private repository = new TrackingRepository();

  async getTrackingDetails(trackingCode: string) {
    const document = await this.repository.findByTrackingCode(trackingCode);
    if (!document) throw new Error('Document not found');
    return document;
  }

  async processDocumentUpdate(
    documentId: string,
    status: any,
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
