// oxlint-disable func-style react/function-component-definition sonarjs/no-wildcard-import
import { createFileRoute, Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";

import { Badge } from "#/components/ui/badge.tsx";
import { buttonVariants } from "#/components/ui/button.tsx";
import { Image } from "#/components/ui/image.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { useCarousel } from "#/hooks/use-carousel.ts";

export const Route = createFileRoute("/_public/landing")({
	component: PublicRoutesLayout,
});

const LoadingSkeleton = () => (
	<div className="w-3/4">
		<div className="mt-12 flex h-125 items-center justify-between rounded-lg">
			<div className="mx-auto basis-1/2 px-16">
				<Skeleton className="mb-4 h-8 w-48" />
				<Skeleton className="mb-2 h-4 w-96" />
				<Skeleton className="mb-8 h-4 w-72" />
				<Skeleton className="h-10 w-40" />
			</div>

			<Skeleton className="h-full basis-1/2 rounded-r-lg" />
		</div>

		<div className="mx-auto mt-10 py-12">
			<Skeleton className="mb-4 h-6 w-48" />
			<Skeleton className="mb-8 h-4 w-full max-w-2xl" />

			<div className="mb-8 flex flex-wrap gap-4">
				{[1, 2, 3, 4, 5].map((_, index) => (
					// oxlint-disable-next-line react-doctor/no-array-index-as-key
					<Skeleton key={index} className="h-6 w-24 rounded-full" />
				))}
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((_, index) => (
					// oxlint-disable-next-line react-doctor/no-array-index-as-key
					<Skeleton key={index} className="h-75 rounded-lg" />
				))}
			</div>
		</div>
	</div>
);

function PublicRoutesLayout() {
	const currentImage = useCarousel({ totalImages: 3 });

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className="w-3/4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<m.div
					className="bg-primary-foreground mt-12 flex h-125 items-center justify-between rounded-lg"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<div className="mx-auto basis-1/2 px-16">
						<div className="mb-4 text-4xl font-bold">Courses</div>

						<p className="mb-8 text-lg text-gray-400">
							This is a list of the courses you can enroll in. <br /> Courses
							when you need them and want them.
						</p>

						<div className="w-fit">
							<Link className={buttonVariants()} to="/search">
								Search for courses
							</Link>
						</div>
					</div>

					<div className="relative h-full basis-1/2 overflow-hidden rounded-r-lg">
						{["/hero1.jpg", "/hero2.jpg", "hero3.jpg"].map((src, index) => (
							<Image
								key={src}
								src={src}
								alt={`Hero Banner ${index + 1}`}
								fill
								priority={index === currentImage}
								sizes="(max-width:768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								className={`object-cover opacity-0 transition-opacity duration-500 ${index === currentImage ? "opacity-100" : ""}`}
							/>
						))}
					</div>
				</m.div>

				<m.div
					className="mx-auto mt-10 py-12"
					initial={{ y: 20, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5 }}
					viewport={{ amount: 0.3, once: true }}
				>
					<h2 className="mb-4 text-2xl font-semibold">Featured Courses</h2>
					<p className="text-muted-foreground mb-8">
						From beginner to advanced, in all industries, we have the right
						courses just for you and preparing your entire journey for learning
						and making the most.
					</p>

					<div className="mb-8 flex flex-wrap gap-4">
						{[
							"web development",
							"enterprise IT",
							"react nextjs",
							"react tanstack",
							"backend development",
						].map((tag) => (
							<Badge key={tag}>{tag}</Badge>
						))}
					</div>

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						{/* COURSES DISPLAY */}
					</div>
				</m.div>
			</m.div>
		</LazyMotion>
	);
}
