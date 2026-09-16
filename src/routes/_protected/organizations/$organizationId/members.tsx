// oxlint-disable react/function-component-definition func-style
import { createFileRoute } from "@tanstack/react-router";

import InviteMemberForm from "#/features/organizations/components/invite-member-form.tsx";
import MembersList from "#/features/organizations/components/members-list.tsx";

export const Route = createFileRoute(
	"/_protected/organizations/$organizationId/members"
)({
	component: MembersPage,
});

function MembersPage() {
	const { organizationId } = Route.useParams();

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
			<h1 className="text-2xl font-semibold">Manage staff</h1>

			<InviteMemberForm organizationId={organizationId} />

			<MembersList organizationId={organizationId} />
		</div>
	);
}
