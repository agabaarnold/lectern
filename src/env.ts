import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		SMTP_HOST: z.string(),
		SMTP_PORT: z.coerce.number().int().min(1).max(65_535),
		SMTP_USER: z.string(),
		SMTP_PASS: z.string(),
		SMTP_FROM: z.email(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
