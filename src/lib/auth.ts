import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "../db";
import { schema } from "../db/schema";
import { sendPasswordResetEmail } from "../features/email/functions/index.ts";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
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
			void sendPasswordResetEmail(user, url);
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
