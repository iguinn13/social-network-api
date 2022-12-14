import jwt from 'jsonwebtoken';

export function generateToken(data: { [key: string]: any }): string {
	return jwt.sign(data, process.env.JWT_SECRET as string);
}

export function verifyToken(token: string): string | jwt.JwtPayload {
	return jwt.verify(token, process.env.JWT_SECRET as string);
}
