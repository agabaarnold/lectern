import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Text,
	Tailwind,
} from "react-email";

interface PasswordResetEmailProps {
	userFirstname: string;
	resetUrl: string;
	forgotPasswordUrl: string;
}

export const PasswordResetEmail = ({
	userFirstname,
	resetUrl,
	forgotPasswordUrl,
}: PasswordResetEmailProps) => (
	<Html>
		<Head />
		<Preview>Reset your password</Preview>
		<Tailwind>
			<Body className="bg-white font-sans">
				<Container className="mx-auto max-w-140 py-5 pb-12">
					<Heading className="text-2xl leading-tight font-semibold text-gray-800">
						Reset your password
					</Heading>
					<Text className="my-4 text-base leading-relaxed text-gray-800">
						Hi {userFirstname},
					</Text>
					<Text className="my-4 text-base leading-relaxed text-gray-800">
						We received a request to reset your password. Click the button below
						to choose a new one.
					</Text>
					<Button
						href={resetUrl}
						className="inline-block rounded-lg bg-black px-7 py-3.5 text-base leading-none font-semibold text-white no-underline"
					>
						Reset password
					</Button>
					<Text className="my-4 text-base leading-relaxed text-gray-800">
						If you didn&apos;t request this, you can safely ignore this email.
						Your password will remain unchanged.
					</Text>
					<Hr className="my-6 border-t border-none border-gray-200" />
					<Text className="text-sm leading-relaxed text-gray-400">
						This link will expire in 1 hour. If you need a new reset link, visit{" "}
						<Link href={forgotPasswordUrl} className="text-black underline">
							forgot password
						</Link>
						.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);
