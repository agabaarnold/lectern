import { useQuery } from "@tanstack/react-query";

import { authClient } from "#/lib/auth-client.ts";

export const useOrgMembers = (organizationId: string | undefined) =>
	useQuery({
		queryKey: ["org-members", organizationId],
		queryFn: async () => {
			if (!organizationId) {
				return [];
			}

			const { data } = await authClient.organization.listMembers({
				query: { organizationId },
			});

			return data?.members ?? [];
		},
		enabled: Boolean(organizationId),
	});

export const useOrgInvitations = (organizationId: string | undefined) =>
	useQuery({
		queryKey: ["org-invitations", organizationId],
		queryFn: async () => {
			if (!organizationId) {
				return [];
			}

			const { data } = await authClient.organization.listInvitations({
				query: { organizationId },
			});
            
			return data ?? [];
		},
		enabled: Boolean(organizationId),
	});
