import { revalidateLogic } from "@tanstack/react-form-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { FieldDescription, FieldGroup } from "#/components/ui/field.tsx";
import { useAppForm } from "#/hooks/form/use-form.ts";
import { authClient } from "#/lib/auth-client.ts";

import { registerSchema } from "../schema";
import type { RegisterInput } from "../schema";

const defaultValues: RegisterInput = {
	email: "",
	name: "",
	password: "",
};

const RegisterForm = () => {
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			await authClient.signUp.email({
				...value,
				fetchOptions: {
					onError: ({ error }) => {
						toast.error(error.message);
					},
					onSuccess: () => {
						toast.success(
							"Account created successfully. Proceed to log-in with your credentials"
						);
						navigate({ to: "/", replace: true });
					},
				},
			});
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "blur",
		}),
		validators: { onSubmit: registerSchema },
	});

	return (
		<Card className="w-full max-w-sm shadow-md md:max-w-md">
			<CardHeader className="text-center">
				<CardTitle className="text-xl font-semibold">
					Create an account
				</CardTitle>
				<CardDescription>
					Fill in the form below to create an account
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
									label="Full name"
									placeholder="Enter your full name"
									type="text"
								/>
							)}
						</form.AppField>

						<form.AppField name="email">
							{(field) => (
								<field.FormInput
									label="Email address"
									placeholder="Enter your email address"
									type="email"
								/>
							)}
						</form.AppField>

						<form.AppField name="password">
							{(field) => (
								<field.FormPassword
									label="Password"
									placeholder="Enter your password"
								/>
							)}
						</form.AppField>

						<form.AppForm>
							<form.SubmitButton
								label="Create account"
								submitLabel="Registering"
							/>
						</form.AppForm>

						<FieldDescription className="text-center">
							Already have an account? <Link to="/login">Login</Link>
						</FieldDescription>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
};

export default RegisterForm;
