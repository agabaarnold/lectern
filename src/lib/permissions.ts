import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	course: ["create", "update", "delete", "publish"],
} as const;

export const ac = createAccessControl(statement);

const owner = ac.newRole({
	course: ["create", "update", "delete", "publish"],
	...ownerAc.statements,
});

const admin = ac.newRole({
	course: ["create", "update", "delete", "publish"],
	...adminAc.statements,
});

const instructor = ac.newRole({
	// no delete, no publish — needs admin/owner sign-off
	course: ["create", "update"],
	...memberAc.statements,
});

export const roles = { owner, admin, instructor } as const;
