import { createAccessControl } from "better-auth/plugins/access";

const statement = {
	course: ["create", "update", "delete", "publish"],
	member: ["invite", "remove", "update-role"],
} as const;

export const ac = createAccessControl(statement);

const owner = ac.newRole({
	course: ["create", "update", "delete", "publish"],
	member: ["invite", "remove", "update-role"],
});

const admin = ac.newRole({
	course: ["create", "update", "delete", "publish"],
	member: ["invite", "remove"],
});

const instructor = ac.newRole({
	// no delete, no publish — needs admin/owner sign-off
	course: ["create", "update"],
	member: [],
});

export const roles = { owner, admin, instructor } as const;
