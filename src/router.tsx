// oxlint-disable func-style
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import ErrorComponent from "#/components/errors/error-component.tsx";
import NotFoundComponent from "#/components/errors/not-found-component.tsx";

import { getContext } from "./integrations/tanstack-query/root-provider";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		defaultErrorComponent: ({ error, reset, info }) => (
			<ErrorComponent error={error} reset={reset} info={info} />
		),
		defaultNotFoundComponent: ({ isNotFound, routeId, data }) => (
			<NotFoundComponent
				data={data}
				isNotFound={isNotFound}
				routeId={routeId}
			/>
		),
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
	});

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
