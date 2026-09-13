import {
	accounts,
	invitations,
	members,
	organizations,
	rateLimits,
	sessions,
	users,
	verifications,
} from "./auth.schema";
import {
	attachments,
	categories,
	chapters,
	courses,
	purchases,
	reviews,
	usersProgress,
} from "./lms.schema";

const schema = {
	accounts,
	attachments,
	categories,
	chapters,
	courses,
	invitations,
	members,
	organizations,
	purchases,
	rateLimits,
	reviews,
	sessions,
	users,
	usersProgress,
	verifications,
} as const;

export { schema };
