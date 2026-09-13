import { createTransport } from "nodemailer";
import { render } from "react-email";

import { env } from "#/env.ts";

import { PasswordResetEmail } from "../templates/password-reset.tsx";

const transporter = createTransport({
	host: env.SMTP_HOST,
	port: env.SMTP_PORT,
	auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export const sendPasswordResetEmail = async (
	user: { email: string; name: string | null },
	url: string
) => {
	const forgotPasswordUrl = `${env.BETTER_AUTH_URL}/forgot-password`;

	const html = await render(
		PasswordResetEmail({
			userFirstname: user.name?.split(" ")[0] ?? "there",
			resetUrl: url,
			forgotPasswordUrl,
		})
	);

	await transporter.sendMail({
		from: env.SMTP_FROM,
		to: user.email,
		subject: "Reset your password",
		html,
	});
};
