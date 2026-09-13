import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

import { organizations, users } from "./auth.schema";

export const categories = pgTable("categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
});

export const courses = pgTable("courses", {
	id: text("id").primaryKey(),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organizations.id),
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
});

export const chapters = pgTable("chapters", {
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
	// upload_status: "waiting" | "processing" | "ready" | "errored"
	muxUploadStatus: text("mux_upload_status"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const attachments = pgTable("attachments", {
	id: text("id").primaryKey(),
	courseId: text("course_id")
		.notNull()
		.references(() => courses.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	url: text("url").notNull(),
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
			.references(() => courses.id),
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

export const reviews = pgTable("reviews", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	courseId: text("course_id")
		.notNull()
		.references(() => courses.id, { onDelete: "cascade" }),
	// rating: 1-5
	rating: integer("rating").notNull(),
	comment: text("comment"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
