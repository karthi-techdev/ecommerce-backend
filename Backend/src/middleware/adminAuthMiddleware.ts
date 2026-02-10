// import rateLimit from 'express-rate-limit';
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { HTTP_STATUS_CODE, HTTP_RESPONSE } from '../utils/httpResponse';

// export const protect = (req: any, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: "Not authorized, no token" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//         req.admin = decoded;
//         next();
//     } catch (error) {
//         res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: "Token expired or invalid" });
//     }
// };
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token expired" });
    }
};