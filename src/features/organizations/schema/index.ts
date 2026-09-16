import { z } from "zod";

export const createOrganizationSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	slug: z
		.string()
		.min(2, "Slug must be at least 2 characters long")
		.regex(/^[a-z0-9-]+$/u, "Lowercase letters, numbers, and hyphens only"),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
