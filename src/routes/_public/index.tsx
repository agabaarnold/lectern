// oxlint-disable func-style react/function-component-definition sonarjs/no-wildcard-import
import { createFileRoute, Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";

import { buttonVariants } from "#/components/ui/button.tsx";

export const Route = createFileRoute("/_public/")({
	component: PublicRoutesLayout,
});

function PublicRoutesLayout() {
	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className="min-h-dvh w-3/4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<m.div
					className="mt-12 flex h-125 items-center justify-between rounded-lg"
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
							<img key={src} src={src} alt={`Hero Banner ${index + 1}`} />
						))}
					</div>
				</m.div>
			</m.div>
		</LazyMotion>
	);
}
