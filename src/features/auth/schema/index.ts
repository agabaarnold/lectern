import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "Email is required").pipe(z.email({ error: "Enter a valid email address" })),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean(),
});
export type LoginInput = z.input<typeof loginSchema>;
