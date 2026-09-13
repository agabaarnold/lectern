import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/*.schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		// SAFETY: dotenv loads DATABASE_URL from .env.local or .env before this configuration is evaluated.
		url: process.env.DATABASE_URL as string,
	},
});
