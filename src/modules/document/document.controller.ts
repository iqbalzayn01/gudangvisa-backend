import { Request, Response, NextFunction } from 'express';
import { DocumentService } from './document.service';

export class DocumentController {
  private documentService = new DocumentService();

  trackDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { trackingCode } = req.params;
      const result = await this.documentService.trackDocument(trackingCode);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const staffId = req.user!.id; // Didapat dari Auth Middleware (Jose)

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
