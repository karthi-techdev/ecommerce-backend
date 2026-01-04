import { Request } from 'express';
import multer from 'multer';

export interface MulterRequest extends Request {
  managementName?: string;
  body: {
    [key: string]: any;
  };
}

export type MulterFile = Express.Multer.File;