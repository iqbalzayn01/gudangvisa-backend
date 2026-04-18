import { DocumentRepository } from './documents.repository.js';
import { AppError } from '../../utils/AppError.js';
import {
  validateFileMetadata,
  generateStoragePath,
  createSignedUploadUrl,
  verifyFileExists,
  createSignedDownloadUrl,
  deleteStorageFile,
} from '../../utils/storage.js';

export class DocumentService {
  private documentRepo = new DocumentRepository();

  /**
   * Generate a signed upload URL for direct client-to-Supabase upload.
   * Validates file metadata (MIME type, optional size) before generating the URL.
   */
  async generateUploadUrl(
    fileName: string,
    contentType: string,
    fileSize?: number,
  ) {
    // Validate file metadata (type, size) before generating upload URL
    validateFileMetadata(fileName, contentType, fileSize);

    // Generate a unique storage path
    const storagePath = generateStoragePath(fileName);

    // Create the signed upload URL
    const uploadData = await createSignedUploadUrl(storagePath);

    return {
      signedUrl: uploadData.signedUrl,
      storagePath: uploadData.path,
      token: uploadData.token,
    };
  }

  /**
   * Create a new document record.
   * If a storagePath is provided, verify the file exists in Supabase Storage first.
   */
  async createNewDoc(
    data: { clientName: string; docType: string },
    staffId: string,
    storagePath?: string,
  ) {
    // If a file was uploaded, verify it exists in storage
    if (storagePath) {
      await verifyFileExists(storagePath);
    }

    // Generate a unique tracking code (e.g., GVI-1712345678)
    const uniqueTrackingCode = `GVI-${Date.now()}`;

    const newDocumentData = {
      trackingCode: uniqueTrackingCode,
      clientName: data.clientName,
      docType: data.docType as 'VISA' | 'KITAS' | 'PASSPORT',
      status: 'RECEIVED' as const,
      fileUrl: storagePath || null,
      createdBy: staffId,
    };

    return await this.documentRepo.createDocumentWithHistory(newDocumentData);
  }

  /**
   * Track a document by its tracking code.
   * Generates a temporary signed download URL for the attached file.
   */
  async trackDocument(trackingCode: string) {
    const document = await this.documentRepo.findByTrackingCode(trackingCode);
    if (!document) {
      throw new AppError(
        404,
        'Document not found. Please check your tracking code.',
      );
    }

    // Generate a temporary signed download URL for the file
    const fileDownloadUrl = await createSignedDownloadUrl(document.fileUrl);

    return {
      ...document,
      fileDownloadUrl,
    };
  }

  /**
   * Update a document's status and add a tracking history entry.
   */
  async updateDocumentProgress(
    documentId: string,
    status: 'RECEIVED' | 'IN_REVIEW' | 'IN_PROCESS' | 'APPROVED' | 'REJECTED' | 'COMPLETED',
    notes: string,
    staffId: string,
  ) {
    return await this.documentRepo.updateStatusWithHistory(
      documentId,
      status,
      notes,
      staffId,
    );
  }

  /**
   * Delete a document, its tracking histories, and its storage file.
   */
  async deleteDocument(documentId: string) {
    // Delete from DB first (returns the doc with fileUrl)
    const deletedDoc = await this.documentRepo.deleteDocumentById(documentId);

    // Clean up the file from Supabase Storage
    await deleteStorageFile(deletedDoc.fileUrl);

    return deletedDoc;
  }
}
