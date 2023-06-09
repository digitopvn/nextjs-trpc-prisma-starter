import { encode, decode } from "next-auth/jwt";
import { User } from "@prisma/client";
import { env } from "~/env.mjs";

export interface AuthUser extends Omit<User, "Password"> { }

export const tokenOneDay = 24 * 60 * 60;
export const tokenOnWeek = tokenOneDay * 7

const craeteJWT = (token: AuthUser, duration: number) => encode({ token, secret: env.NEXTAUTH_SECRET, maxAge: duration })

export const jwtHelper = {
  createAcessToken: (token: AuthUser) => craeteJWT(token, tokenOneDay),
  createRefreshToken: (token: AuthUser) => craeteJWT(token, tokenOnWeek),
  verifyToken: (token: string) => decode({ token, secret: env.NEXTAUTH_SECRET })
}