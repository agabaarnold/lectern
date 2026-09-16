import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { useOrgInvitations, useOrgMembers } from "#/hooks/use-org-members.ts";
import { useOrgPermission } from "#/hooks/use-org-permission.ts";
import { authClient } from "#/lib/auth-client.ts";

interface MembersListProps {
	organizationId: string;
}

const MembersList = ({ organizationId }: MembersListProps) => {
	const queryClient = useQueryClient();
	const { data: members, isPending: membersPending } =
		useOrgMembers(organizationId);
	const { data: invitations } = useOrgInvitations(organizationId);
	const { data: canRemove } = useOrgPermission(organizationId, {
		member: ["delete"],
	});
	const { data: canCancelInvites } = useOrgPermission(organizationId, {
		invitation: ["cancel"],
	});

	const handleRemove = async (memberId: string) => {
		await authClient.organization.removeMember({
			memberIdOrEmail: memberId,
			organizationId,
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message);
				},
				onSuccess: () => {
					toast.success("Member removed");
					void queryClient.invalidateQueries({
						queryKey: ["org-members", organizationId],
					});
				},
			},
		});
	};

	const handleCancelInvite = async (invitationId: string) => {
		await authClient.organization.cancelInvitation({
			invitationId,
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message);
				},
				onSuccess: () => {
					toast.success("Invitation cancelled");
					void queryClient.invalidateQueries({
						queryKey: ["org-invitations", organizationId],
					});
				},
			},
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Staff</CardTitle>
				</CardHeader>

				<CardContent className="flex flex-col gap-2">
					{membersPending && (
						<p className="text-muted-foreground text-sm">Loading…</p>
					)}

					{members?.map((member) => (
						<div className="flex items-center justify-between" key={member.id}>
							<div>
								<p className="text-sm font-medium">{member.user.name}</p>
								<p className="text-muted-foreground text-xs">{member.role}</p>
							</div>
                            
							{canRemove && (
								<Button
									onClick={() => handleRemove(member.id)}
									size="sm"
									variant="destructive"
								>
									Remove
								</Button>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			{(invitations?.length ?? 0) > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Pending invites</CardTitle>
					</CardHeader>

					<CardContent className="flex flex-col gap-2">
						{invitations?.map((invitation) => (
							<div
								className="flex items-center justify-between"
								key={invitation.id}
							>
								<div>
									<p className="text-sm font-medium">{invitation.email}</p>
									<p className="text-muted-foreground text-xs">
										{invitation.role} · {invitation.status}
									</p>
								</div>

								{canCancelInvites && invitation.status === "pending" && (
									<Button
										onClick={() => handleCancelInvite(invitation.id)}
										size="sm"
										variant="outline"
									>
										Cancel
									</Button>
								)}
							</div>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default MembersList;
