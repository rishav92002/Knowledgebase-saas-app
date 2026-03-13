import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

type TokenPayload = Omit<JwtPayload, "iat" | "exp">;

export const generateToken = (payload: TokenPayload, secretKey: string, expiresIn: jwt.SignOptions["expiresIn"]): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export const verifyToken = (token: string, secretKey: string): JwtPayload | null => {
    try {
        return jwt.verify(token, secretKey) as JwtPayload;
    } catch {
        return null;
    }
}