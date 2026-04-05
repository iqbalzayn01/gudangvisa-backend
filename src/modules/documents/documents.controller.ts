import { Request, Response, NextFunction } from 'express';
import { DocumentService } from './documents.service.js';
import { ApiResponse } from '../../types/index.js';

export class DocumentController {
  private documentService = new DocumentService();

  createDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documentData = req.body;
      const staffId = req.user.id;

      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const newDocument = await this.documentService.createNewDoc(
        documentData,
        staffId,
        fileUrl,
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
}
