import { IconBuilding, IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import { buttonVariants } from "#/components/ui/button.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { authClient } from "#/lib/auth-client.ts";

const OrganizationSwitcher = () => {
	const { data: organizations } = authClient.useListOrganizations();
	const { data: activeOrganization } = authClient.useActiveOrganization();

	useEffect(() => {
		if (organizations?.length === 1 && !activeOrganization) {
			void authClient.organization.setActive({
				organizationId: organizations[0].id,
			});
		}
	}, [organizations, activeOrganization]);

	if (!organizations?.length) {
		return (
			<Link
				className={buttonVariants({ variant: "outline" })}
				to="/organizations/new"
			>
				<IconPlus data-icon="inline-start" />
				Create a school
			</Link>
		);
	}

	return (
		<Select
			onValueChange={(organizationId) => {
				if (organizationId) {
					void authClient.organization.setActive({ organizationId });
				}
			}}
			value={activeOrganization?.id}
		>
			<SelectTrigger>
				<IconBuilding data-icon="inline-start" />
				<SelectValue placeholder="Select a school" />
			</SelectTrigger>

			<SelectContent>
				{organizations.map((org) => (
					<SelectItem key={org.id} value={org.id}>
						{org.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default OrganizationSwitcher;
