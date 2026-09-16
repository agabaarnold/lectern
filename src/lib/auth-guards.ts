import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";

import { db } from "#/db";
import { courses, purchases } from "#/db/schema/lms.schema.ts";

import { auth } from "./auth";
import type { Permission } from "./permissions";

export const requireSession = async () => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw new Error("UNAUTHENTICATED");
	}
	return session;
};

export const requireOrgPermission = async (
	organizationId: string,
	permissions: Permission
) => {
	const session = await requireSession();
	const headers = getRequestHeaders();

	const allowed = await auth.api.hasPermission({
		headers,
		body: { organizationId, permissions },
	});

	if (!allowed) {
		throw new Error("FORBIDDEN");
	}
	return session;
};

export const requireCourseManageAccess = async (
	courseId: string,
	permissions: Permission
) => {
	const session = await requireSession();

	if (session.user.role === "admin") {
		// platform superadmin bypass
		return session;
	}

	const [existing] = await db
		.select()
		.from(courses)
		.where(eq(courses.id, courseId));
	if (!existing) {
		throw new Error("NOT_FOUND");
	}

	await requireOrgPermission(existing.organizationId, permissions);
	return session;
};

export const requireCoursePurchased = async (
	userId: string,
	courseId: string
) => {
	const [existing] = await db
		.select()
		.from(purchases)
		.where(and(eq(purchases.userId, userId), eq(purchases.courseId, courseId)));
	if (!existing) {
		throw new Error("FORBIDDEN");
	}
};
