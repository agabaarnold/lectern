import {
	accounts,
	invitations,
	members,
	organizations,
	sessions,
	users,
	verifications,
} from "./auth.schema";

const schema = {
	accounts,
	invitations,
	members,
	organizations,
	sessions,
	users,
	verifications,
} as const;

export { schema };
