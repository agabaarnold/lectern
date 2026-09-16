// oxlint-disable react/function-component-definition func-style
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Spinner } from "#/components/ui/spinner.tsx";
import { authClient } from "#/lib/auth-client.ts";

export const Route = createFileRoute(
	"/_protected/accept-invitation/$invitationId"
)({
	component: AcceptInvitationPage,
});

function AcceptInvitationPage() {
	const { invitationId } = Route.useParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<"pending" | "error">("pending");

	useEffect(() => {
		void authClient.organization.acceptInvitation({
			invitationId,
			fetchOptions: {
				onError: ({ error }) => {
					setStatus("error");
					toast.error(error.message);
				},
				onSuccess: async ({ data }) => {
					if (data?.invitation.organizationId) {
						await authClient.organization.setActive({
							organizationId: data.invitation.organizationId,
						});
					}
					toast.success("You've joined the school");
					navigate({ to: "/" });
				},
			},
		});
	}, [invitationId, navigate]);

	if (status === "error") {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Card className="w-full max-w-sm">
					<CardHeader className="text-center">
						<CardTitle>Invitation invalid or expired</CardTitle>
						<CardDescription>
							Ask the school owner to send a new invite.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Spinner className="size-8" />
		</div>
	);
}
