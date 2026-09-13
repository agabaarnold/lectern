import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { organizations, users } from "./auth.schema";

export const muxUploadStatusEnum = pgEnum("mux_upload_status", [
	"waiting",
	"processing",
	"ready",
	"errored",
]);

export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	imageUrl: text("image_url"),
	position: integer("position").notNull().default(0),
});

export const courses = pgTable(
	"courses",
	{
		id: text("id").primaryKey(),
		organizationId: text("organization_id")
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		createdByUserId: text("created_by_user_id")
			.notNull()
			// attribution only, not ownership
			.references(() => users.id),
		title: text("title").notNull(),
		description: text("description"),
		imageUrl: text("image_url"),
		priceCents: integer("price_cents"),
		categoryId: text("category_id").references(() => categories.id),
		isPublished: boolean("is_published").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		deletedAt: timestamp("deleted_at"),
	},
	(t) => [
		index("courses_organizationId_idx").on(t.organizationId),
		index("courses_categoryId_idx").on(t.categoryId),
		index("courses_organizationId_isPublished_idx").on(
			t.organizationId,
			t.isPublished
		),
	]
);

export const chapters = pgTable(
	"chapters",
	{
		id: text("id").primaryKey(),
		courseId: text("course_id")
			.notNull()
			.references(() => courses.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		position: integer("position").notNull(),
		isPublished: boolean("is_published").notNull().default(false),
		isFree: boolean("is_free").notNull().default(false),
		muxAssetId: text("mux_asset_id"),
		muxPlaybackId: text("mux_playback_id"),
		muxUploadStatus: muxUploadStatusEnum("mux_upload_status"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
		deletedAt: timestamp("deleted_at"),
	},
	(t) => [uniqueIndex("chapter_course_position_idx").on(t.courseId, t.position)]
);

export const attachments = pgTable("attachments", {
	id: text("id").primaryKey(),
	courseId: text("course_id")
		.notNull()
		.references(() => courses.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	url: text("url").notNull(),
	mimeType: text("mime_type"),
	size: integer("size"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const purchases = pgTable(
	"purchases",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		courseId: text("course_id")
			.notNull()
			.references(() => courses.id, { onDelete: "cascade" }),
		stripeSessionId: text("stripe_session_id").notNull().unique(),
		amountCents: integer("amount_cents").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [uniqueIndex("purchase_user_course_idx").on(t.userId, t.courseId)]
);

export const usersProgress = pgTable(
	"users_progress",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		chapterId: text("chapter_id")
			.notNull()
			.references(() => chapters.id, { onDelete: "cascade" }),
		isCompleted: boolean("is_completed").notNull().default(false),
		lastPositionSeconds: integer("last_position_seconds").notNull().default(0),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(t) => [uniqueIndex("progress_user_chapter_idx").on(t.userId, t.chapterId)]
);

export const reviews = pgTable(
	"reviews",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id),
		courseId: text("course_id")
			.notNull()
			.references(() => courses.id, { onDelete: "cascade" }),
		rating: integer("rating").notNull(),
		comment: text("comment"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [
		uniqueIndex("review_user_course_idx").on(t.userId, t.courseId),
		check("review_rating_check", sql`${t.rating} >= 1 AND ${t.rating} <= 5`),
	]
);
