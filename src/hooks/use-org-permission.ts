import { useQuery } from "@tanstack/react-query";

import { authClient } from "#/lib/auth-client.ts";
import type { Permission } from "#/lib/permissions.ts";

export const useOrgPermission = (
	organizationId: string | undefined,
	permissions: Permission
) =>
	useQuery({
		queryKey: ["org-permission", organizationId, permissions],
		queryFn: async () => {
			if (!organizationId) {
				return false;
			}

			const { data } = await authClient.organization.hasPermission({
				organizationId,
				permissions,
			});

			return data?.success ?? false;
		},
		enabled: Boolean(organizationId),
	});
