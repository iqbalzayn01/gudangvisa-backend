import { Request, Response, NextFunction } from 'express';
import { TrackingService } from './tracking.service';
import { ApiResponse } from '../../types';

export class TrackingController {
  private service = new TrackingService();

  trackByCode = async (
    req: Request<{ code: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { code } = req.params;
      const result = await this.service.getTrackingDetails(code);

      const response: ApiResponse = {
        success: true,
        message: 'Document found',
        data: result,
      };

      res.status(200).json(response);
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
      const staffId = req.user.id;

      const updatedDoc = await this.service.processDocumentUpdate(
        id,
        status,
        notes,
        staffId,
      );

      const response: ApiResponse = {
        success: true,
        message: 'Status updated successfully',
        data: updatedDoc,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
