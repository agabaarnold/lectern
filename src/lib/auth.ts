import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth/minimal";
import { organization } from "better-auth/plugins/organization";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "../db";
import { schema } from "../db/schema";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
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
