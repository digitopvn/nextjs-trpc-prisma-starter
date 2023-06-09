import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
// import * as bcrypt from "bcrypt";
import { AuthUser, jwtHelper, tokenOneDay, tokenOnWeek } from "~/server/api/jwtHelper";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			// ...other properties
			// role: UserRole;
		} & DefaultSession["user"];
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
		maxAge: 60 * 60,
	},
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		FacebookProvider({
			clientId: env.FACEBOOK_CLIENT_ID,
			clientSecret: env.FACEBOOK_CLIENT_SECRET,
		}),
		CredentialsProvider({
			async authorize(credentials, req) {
				let screen = "customer";
				let credentialsJson = credentials as any;
				if (credentialsJson.screen) screen = credentialsJson.screen;

				try {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials?.email,
						},
					});
					if (user && credentials && user.screen == screen) {
						// const validPassword = await bcrypt.compare(credentials?.password, user.password);
						const validPassword = true;
						if (validPassword) {
							return {
								id: user.id,
								name: user.name,
								screen: user.screen,
							};
						}
					}
				} catch (error) {
					console.log(error);
				}
				return null;
			},
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "example@gmail.com",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, profile, account, isNewUser }: any) {
			// credentials provider:  Save the access token and refresh token in the JWT on the initial login
			if (user) {
				const authUser = { id: user.id, name: user.name } as AuthUser;

				const accessToken = await jwtHelper.createAcessToken(authUser);
				const refreshToken = await jwtHelper.createRefreshToken(authUser);
				const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
				const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

				return {
					...token,
					accessToken,
					refreshToken,
					accessTokenExpired,
					refreshTokenExpired,
					user: authUser,
				};
			} else {
				if (token) {
					// In subsequent requests, check access token has expired, try to refresh it
					if (Date.now() / 1000 > token.accessTokenExpired) {
						const verifyToken = await jwtHelper.verifyToken(token.refreshToken);

						if (verifyToken) {
							const user = await prisma.user.findFirst({
								where: {
									id: token.user.id,
								},
							});

							if (user) {
								const accessToken = await jwtHelper.createAcessToken(token.user);
								const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

								return { ...token, accessToken, accessTokenExpired };
							}
						}

						return { ...token, error: "RefreshAccessTokenError" };
					}
				}
			}

			return token;
		},
		async session({ session, token }: any) {
			if (token) {
				session.user = {
					name: token.user.name,
					userId: token.user.id,
				};
			}
			session.error = token.error;
			return session;
		},
	},
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
