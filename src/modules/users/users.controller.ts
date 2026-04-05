import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
import { ApiResponse } from '../../types/index.js';
import { AppError } from '../../utils/AppError.js';

export class UsersController {
  private service = new UsersService();

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userLogged = req.user;

      if (!userLogged) {
        throw new AppError(401, 'User not found or not logged in.');
      }

      const response: ApiResponse = {
        success: true,
        message: 'User profile retrieved successfully!',
        data: {
          id: userLogged.id,
          name: userLogged.name,
          email: userLogged.email,
          role: userLogged.role,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

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

// ------------------------------------------------------
// export class UsersController {
//   private service = new UsersService();

//   getMe = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const tokenPayload = req.user;

//       if (!tokenPayload) {
//         throw new AppError(401, 'You are not logged in.');
//       }

//       const currentUser = await db.query.users.findFirst({
//         where: eq(users.id, tokenPayload.id),
//       });

//       if (!currentUser) {
//         throw new AppError(404, 'User profile no longer exists.');
//       }

//       const response: ApiResponse = {
//         success: true,
//         message: 'User profile retrieved successfully!',
//         data: {
//           id: currentUser.id,
//           name: currentUser.name,
//           email: currentUser.email,
//           role: currentUser.role,
//         },
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       next(error);
//     }
//   };
