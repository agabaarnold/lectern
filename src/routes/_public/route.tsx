// oxlint-disable func-style react/function-component-definition
import { IconBook } from "@tabler/icons-react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { buttonVariants } from "#/components/ui/button.tsx";

export const Route = createFileRoute("/_public")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<nav className="bg-primary/75 sticky top-0 z-50 flex h-16 w-full shrink-0 justify-center backdrop-blur-lg">
				<div className="flex w-3/4 items-center justify-between py-8">
					<div className="flex w-full items-center justify-between">
						<Link
							className="hover:text-muted-foreground text-secondary text-lg font-bold sm:text-xl"
							to="/"
						>
							Lectern
						</Link>

						<Link
							className={buttonVariants({ variant: "outline" })}
							to="/search"
						>
							<IconBook />
							<span className="hidden sm:inline">Search Courses</span>
							<span className="sm:hidden">Search</span>
						</Link>

						<div className="flex items-center justify-between gap-4">
							<Link
								className={buttonVariants({ variant: "secondary" })}
								to="/login"
							>
								Login
							</Link>

							<Link className={buttonVariants()} to="/register">
								Register
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<main className="flex min-h-dvh w-full grow items-center justify-center">
				<Outlet />
			</main>

			<footer className="bg-primary/75 text-secondary bottom-0 mt-10 w-full py-8 text-center text-sm">
				<p>&copy; 2026 Lectern. All rights reserved</p>

				<div className="mt-2">
					{["About", "Privacy Policy", "Licensing", "Contact"].map((item) => (
						<Link
							className="mx-2"
							key={item}
							// @ts-expect-error: These pages are just placeholders
							to={`/${item.toLowerCase().replace(" ", "-")}`}
						>
							{item}
						</Link>
					))}
				</div>
			</footer>
		</div>
	);
}
