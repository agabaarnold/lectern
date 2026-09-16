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
			<nav className="sticky top-0 z-50 flex h-16 w-full shrink-0 justify-center backdrop-blur-lg">
				<div className="flex w-3/4 items-center justify-between py-8">
					<div className="flex w-full items-center justify-between">
						<Link
							className="hover:text-muted-foreground text-lg font-bold sm:text-xl"
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

			<main className="flex w-full grow items-center justify-center">
				<Outlet />
			</main>
		</div>
	);
}
