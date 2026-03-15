import { SignJWT, jwtVerify } from 'jose';

export interface JwtPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

type TokenPayload = Omit<JwtPayload, "iat" | "exp">;

export const generateToken = async (payload: TokenPayload, secretKey: string, expiresIn: string): Promise<string> => {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(new TextEncoder().encode(secretKey));
};

export const verifyToken = async (token: string, secretKey: string): Promise<JwtPayload | null> => {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secretKey), {
            algorithms: ['HS256'],
        });
        return payload as unknown as JwtPayload;
    } catch {
        return null;
    }
};