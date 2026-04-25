import { Request, Response, NextFunction } from 'express';
import { DocumentService } from './documents.service.js';
import { ApiResponse } from '../../types/index.js';

export class DocumentController {
  private documentService = new DocumentService();

  /**
   * Generate a signed upload URL for the client to upload a file directly to Supabase Storage.
   * POST /api/v1/documents/upload-url
   * Body: { fileName: string, contentType: string, fileSize?: number }
   */
  getUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fileName, contentType, fileSize } = req.body;
      const result = await this.documentService.generateUploadUrl(
        fileName,
        contentType,
        fileSize,
      );

      const response: ApiResponse = {
        success: true,
        message: 'Signed upload URL generated successfully.',
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all documents sorted by newest first.
   * GET /api/v1/documents
   */
  getAllDocuments = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const allDocuments = await this.documentService.getAllDocuments();

      const response: ApiResponse = {
        success: true,
        message: 'Documents retrieved successfully.',
        data: allDocuments,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new document record after the file has been uploaded to storage.
   * POST /api/v1/documents
   * Body: { clientName: string, docType: string, storagePath?: string }
   */
  createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientName, docType, storagePath } = req.body;
      const staffId = req.user.id;

      const newDocument = await this.documentService.createNewDoc(
        { clientName, docType },
        staffId,
        storagePath,
      );

      const response: ApiResponse = {
        success: true,
        message: 'Document created successfully!',
        data: newDocument,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Track a document by its tracking code (public).
   * GET /api/v1/documents/track/:trackingCode
   */
  trackDocument = async (
    req: Request<{ trackingCode: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { trackingCode } = req.params;
      const result = await this.documentService.trackDocument(trackingCode);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a document's status and add a tracking history entry.
   * PATCH /api/v1/documents/:id/status
   * Body: { status: string, notes: string }
   */
  updateStatus = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const staffId = req.user!.id;

      const result = await this.documentService.updateDocumentProgress(
        id,
        status,
        notes,
        staffId,
      );

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a document, its tracking histories, and its storage file.
   * DELETE /api/v1/documents/:id
   */
  deleteDocument = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      await this.documentService.deleteDocument(id);

      const response: ApiResponse = {
        success: true,
        message: 'Document deleted successfully.',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
