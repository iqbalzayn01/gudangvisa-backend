// src/types/express/index.d.ts

// This file extends the default Express Request object.
// Now, TypeScript will automatically know that `req.user` exists
// in all your controllers and middlewares.

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

// This empty export is required to make this file a module
export {};
