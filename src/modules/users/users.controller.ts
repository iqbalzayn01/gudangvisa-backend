import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
import { ApiResponse } from '../../types/index.js';

export class UsersController {
  private service = new UsersService();

  createStaff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const newUser = await this.service.createNewStaff(userData);

      const response: ApiResponse = {
        success: true,
        message: 'New staff member added successfully!',
        data: newUser,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllStaff = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const usersList = await this.service.getAllStaff();

      const response: ApiResponse = {
        success: true,
        message: 'Staff list retrieved successfully',
        data: usersList,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteStaff = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      await this.service.removeStaff(id);

      const response: ApiResponse = {
        success: true,
        message: 'Staff member deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
