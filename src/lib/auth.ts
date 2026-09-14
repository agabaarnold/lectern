import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { lastLoginMethod } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { haveIBeenPwned } from "better-auth/plugins/haveibeenpwned";
import { organization } from "better-auth/plugins/organization";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { env } from "#/env.ts";

import { db } from "../db";
import { schema } from "../db/schema";
import { sendPasswordResetEmail } from "../features/email/functions/index.ts";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		revokeSessionsOnPasswordReset: true,
		// oxlint-disable-next-line require-await
		sendResetPassword: async ({ user, url }) => {
			// oxlint-disable-next-line promise/prefer-await-to-then promise/prefer-await-to-callbacks github/no-then
			void sendPasswordResetEmail(user, url).catch((error) => {
				console.error("Failed to send password-reset email", error);
			});
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			prompt: "select_account consent",
		},
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			mapProfileToUser: (profile) => ({
				email: profile.email ?? `${profile.id}@github.placeholder.invalid`,
			}),
		},
	},
	rateLimit: {
		storage: "database",
		customRules: {
			"/sign-in/email": {
				window: 10,
				max: 3,
			},
			"/forgot-password": {
				window: 60,
				max: 3,
			},
			"/reset-password": {
				window: 60,
				max: 5,
			},
		},
	},
	plugins: [
		admin(),
		organization({
			ac,
			creatorRole: "owner",
			roles,
			allowUserToCreateOrganization: true,
			requireEmailVerificationOnInvitation: true,
		}),
		lastLoginMethod(),
		haveIBeenPwned({
			enabled: env.NODE_ENV === "production",
			customPasswordCompromisedMessage: "Please choose a more secure password.",
		}),
		tanstackStartCookies(),
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
});

export type Session = typeof auth.$Infer.Session;
