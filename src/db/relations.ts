import { defineRelations, defineRelationsPart } from "drizzle-orm";

import { schema } from "./schema";
import {
	accounts,
	invitations,
	members,
	organizations,
	sessions,
	users,
	verifications,
} from "./schema/auth.schema";

export const relations = defineRelations(schema, () => ({}));

export const authRelations = defineRelationsPart(
	{
		users,
		sessions,
		accounts,
		verifications,
		organizations,
		members,
		invitations,
	},
	(r) => ({
		users: {
			sessions: r.many.sessions({
				from: r.users.id,
				to: r.sessions.userId,
			}),
			accounts: r.many.accounts({
				from: r.users.id,
				to: r.accounts.userId,
			}),
			members: r.many.members({
				from: r.users.id,
				to: r.members.userId,
			}),
			invitations: r.many.invitations({
				from: r.users.id,
				to: r.invitations.inviterId,
			}),
		},
		sessions: {
			user: r.one.users({
				from: r.sessions.userId,
				to: r.users.id,
			}),
		},
		accounts: {
			user: r.one.users({
				from: r.accounts.userId,
				to: r.users.id,
			}),
		},
		organizations: {
			members: r.many.members({
				from: r.organizations.id,
				to: r.members.organizationId,
			}),
			invitations: r.many.invitations({
				from: r.organizations.id,
				to: r.invitations.organizationId,
			}),
		},
		members: {
			organization: r.one.organizations({
				from: r.members.organizationId,
				to: r.organizations.id,
			}),
			user: r.one.users({
				from: r.members.userId,
				to: r.users.id,
			}),
		},
		invitations: {
			organization: r.one.organizations({
				from: r.invitations.organizationId,
				to: r.organizations.id,
			}),
			user: r.one.users({
				from: r.invitations.inviterId,
				to: r.users.id,
			}),
		},
	})
);
