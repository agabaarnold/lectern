import { useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "#/components/ui/button.tsx";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { useOrgPermission } from "#/hooks/use-org-permission.ts";
import { authClient } from "#/lib/auth-client.ts";

// deliberately excludes "owner" — ownership transfer is a separate flow, not a normal invite
const inviteRoles = ["orgAdmin", "instructor"] as const;

interface InviteMemberFormProps {
	organizationId: string;
}

const InviteMemberForm = ({ organizationId }: InviteMemberFormProps) => {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<(typeof inviteRoles)[number]>("instructor");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: canInvite, isPending } = useOrgPermission(organizationId, {
		invitation: ["create"],
	});

	if (isPending) {
		return null;
	}

	if (!canInvite) {
		return null; // hide entirely rather than show a disabled form — this isn't the security boundary, inviteMember's own server-side check is
	}

	const handleInvite = async () => {
		setIsSubmitting(true);

		await authClient.organization.inviteMember({
			email,
			role,
			organizationId,
			fetchOptions: {
				onError: ({ error }) => {
					toast.error(error.message);
				},
				onSuccess: () => {
					toast.success(`Invited ${email}`);
					setEmail("");
				},
			},
		});

		setIsSubmitting(false);
	};

	return (
		<FieldGroup>
			<Field>
				<FieldLabel htmlFor="invite-email">Email</FieldLabel>
				<Input
					id="invite-email"
					onChange={(e) => setEmail(e.target.value)}
					placeholder="jane@example.com"
					type="email"
					value={email}
				/>
			</Field>

			<Field>
				<FieldLabel htmlFor="invite-role">Role</FieldLabel>
				<Select
					onValueChange={(value) =>
						setRole(value as (typeof inviteRoles)[number])
					}
					value={role}
				>
					<SelectTrigger id="invite-role">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{inviteRoles.map((r) => (
							<SelectItem key={r} value={r}>
								{r}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Button
				disabled={!email || isSubmitting}
				onClick={handleInvite}
				type="button"
			>
				Send invite
			</Button>
		</FieldGroup>
	);
};

export default InviteMemberForm;
