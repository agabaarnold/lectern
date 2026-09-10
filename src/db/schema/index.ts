import { accounts, sessions, users, verifications } from "./auth.schema";

const schema = { accounts, sessions, users, verifications } as const;

export { schema };
