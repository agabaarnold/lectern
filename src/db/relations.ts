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

export const relations = defineRelations(schema, (r) => ({
	attachments: {
		course: r.one.courses({
			from: r.attachments.courseId,
			to: r.courses.id,
		}),
	},

	categories: {
		courses: r.many.courses(),
	},

	courses: {
		organizations: r.one.organizations({
			from: r.courses.organizationId,
			to: r.organizations.id,
		}),
		createdBy: r.one.users({
			from: r.courses.createdByUserId,
			to: r.users.id,
		}),
		category: r.one.categories({
			from: r.courses.categoryId,
			to: r.categories.id,
		}),
		chapters: r.many.chapters(),
		attachments: r.many.attachments(),
		reviews: r.many.reviews(),
		purchases: r.many.purchases(),
	},

	chapters: {
		course: r.one.courses({
			from: r.chapters.courseId,
			to: r.courses.id,
		}),
		progress: r.many.usersProgress(),
	},

	organizations: {
		courses: r.many.courses(),
	},

	users: {
		courses: r.many.courses(),
		purchases: r.many.purchases(),
		reviews: r.many.reviews(),
	},

	usersProgress: {
		user: r.one.users({
			from: r.usersProgress.userId,
			to: r.users.id,
		}),
		chapter: r.one.chapters({
			from: r.usersProgress.chapterId,
			to: r.chapters.id,
		}),
	},

	reviews: {
		course: r.one.courses({
			from: r.reviews.courseId,
			to: r.courses.id,
		}),
		user: r.one.users({
			from: r.reviews.userId,
			to: r.users.id,
		}),
	},

	purchases: {
		user: r.one.users({
			from: r.purchases.userId,
			to: r.users.id,
		}),
		course: r.one.courses({
			from: r.purchases.courseId,
			to: r.courses.id,
		}),
	},
}));

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
