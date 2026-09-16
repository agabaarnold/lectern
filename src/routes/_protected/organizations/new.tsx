// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

import CreateOrganizationForm from "#/features/organizations/components/create-organization-form.tsx";

export const Route = createFileRoute("/_protected/organizations/new")({
	component: NewOrganizationPage,
});

function NewOrganizationPage() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<CreateOrganizationForm />
		</div>
	);
}
