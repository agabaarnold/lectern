// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
});

function RouteComponent() {
	return <div />;
}
