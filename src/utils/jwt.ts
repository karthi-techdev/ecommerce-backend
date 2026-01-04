import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomError } from './customError';
import { HTTP_STATUS_CODE } from './httpResponse';
import config from '../config/validator';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}


const JWT_SECRET = config.jwt.secret || process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
}


const ACCESS_TOKEN_EXPIRY = 900; 
const REFRESH_TOKEN_EXPIRY = 604800; 

export const generateToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: 'HS256'
    };
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        algorithm: 'HS256'
    };
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new CustomError('Token has expired', HTTP_STATUS_CODE.UNAUTHORIZED);
        }
        throw new CustomError('Invalid token', HTTP_STATUS_CODE.UNAUTHORIZED);
    }
};

const usedRefreshTokens = new Set<string>();

export const rotateRefreshToken = (oldToken: string): { accessToken: string; refreshToken: string } => {
    
    if (usedRefreshTokens.has(oldToken)) {
        throw new CustomError('Refresh token has been used', HTTP_STATUS_CODE.UNAUTHORIZED);
    }

    const decoded = verifyToken(oldToken);
    
    usedRefreshTokens.add(oldToken);

    if (usedRefreshTokens.size > 1000) {
        usedRefreshTokens.clear();
    }


    const accessToken = generateToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
    });

    const refreshToken = generateRefreshToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
    });

    return { accessToken, refreshToken };
};