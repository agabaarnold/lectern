// oxlint-disable react/function-component-definition func-style
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getUserSession } from "#/features/auth/functions/index.ts";
import OrganizationSwitcher from "#/features/organizations/components/organization-switcher.tsx";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad: async ({ location }) => {
		const { session } = await getUserSession();
		if (!session) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}

		return { user: session.user };
	},
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex items-center justify-between border-b px-4 py-2">
				<span className="font-heading font-semibold">Lectern</span>
				
				<OrganizationSwitcher />
			</header>

			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
