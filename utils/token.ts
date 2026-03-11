import jwt from "jsonwebtoken";

export const generateToken = (payload: object, secretKey: string, expiresIn: jwt.SignOptions["expiresIn"]): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
}

export const verifyToken = (token: string, secretKey: string): object | string => {
    return jwt.verify(token, secretKey);
}