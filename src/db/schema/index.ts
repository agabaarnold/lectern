import {
	accounts,
	invitations,
	members,
	organizations,
	rateLimit,
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
	rateLimit,
	reviews,
	sessions,
	users,
	usersProgress,
	verifications,
} as const;

export { schema };
