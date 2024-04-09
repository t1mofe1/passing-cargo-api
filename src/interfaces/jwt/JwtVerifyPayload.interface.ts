import { JwtTokenPayload } from './JwtTokenPayload.interface';

export type JwtVerifyPayload = JwtTokenPayload & { iat: number; exp: number };
