import { Request, Response, NextFunction } from 'express';
import { TrackingService } from './tracking.service';

export class TrackingController {
  private service = new TrackingService();

  trackByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const result = await this.service.getTrackingDetails(code);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const staffId = req.user.id;

      const result = await this.service.processDocumentUpdate(
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
