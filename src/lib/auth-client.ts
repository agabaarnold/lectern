import {
	adminClient,
	inferAdditionalFields,
	lastLoginMethodClient,
	organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./auth";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		organizationClient({ ac, roles }),
		inferAdditionalFields<typeof auth>(),
		lastLoginMethodClient()
	],
});
