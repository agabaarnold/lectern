import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { FieldGroup } from "#/components/ui/field.tsx";
import { useAppForm } from "#/hooks/form/use-form.ts";
import { authClient } from "#/lib/auth-client.ts";

import { createOrganizationSchema } from "../schema";
import type { CreateOrganizationInput } from "../schema";

const defaultValues: CreateOrganizationInput = { name: "", slug: "" };

const CreateOrganizationForm = () => {
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			await authClient.organization.create({
				name: value.name,
				slug: value.slug,
				fetchOptions: {
					onError: ({ error }) => {
						toast.error(error.message);
					},
					onSuccess: async ({ data }) => {
						await authClient.organization.setActive({
							organizationId: data.id,
						});
						toast.success("School created");
						navigate({ to: "/" });
					},
				},
			});
		},
		validators: { onSubmit: createOrganizationSchema },
	});

	return (
		<Card className="w-full max-w-sm shadow-md md:max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-xl font-semibold">
					Create your school
				</CardTitle>
				<CardDescription>
					This becomes the organization your courses and staff belong to
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.AppField name="name">
							{(field) => (
								<field.FormInput
									label="School name"
									placeholder="e.g. Acme Academy"
									type="text"
								/>
							)}
						</form.AppField>

						<form.AppField name="slug">
							{(field) => (
								<field.FormInput
									label="URL slug"
									placeholder="acme-academy"
									type="text"
								/>
							)}
						</form.AppField>

						<form.AppForm>
							<form.SubmitButton label="Create school" submitLabel="Creating" />
						</form.AppForm>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreateOrganizationForm;
