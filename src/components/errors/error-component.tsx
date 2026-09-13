import {
	IconAlertTriangle,
	IconArrowLeft,
	IconBug,
	IconHome,
	IconRefresh,
} from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";

import { Button, buttonVariants } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

// oxlint-disable-next-line anti-slop/no-unknown-parameters
const getErrorMessage = (error: unknown): string | null => {
	if (error instanceof Error && error.message) {
		return error.message;
	}

	// oxlint-disable-next-line anti-slop/no-runtime-typeof
	if (typeof error === "string" && error.trim()) {
		return error;
	}

	return null;
};

const ErrorComponent = ({ error }: ErrorComponentProps) => {
	const router = useRouter();
	const errorMessage = getErrorMessage(error);

	const handleRetry = () => {
		void router.invalidate();
	};

	const handleBack = () => {
		router.history.back();
	};

	return (
		<main className="flex min-h-[60svh] items-center justify-center px-4 py-10 shadow-md sm:px-6">
			<Card className="w-full max-w-lg">
				<CardHeader className="flex flex-col items-center text-center">
					<div
						aria-hidden="true"
						className="bg-destructive/10 mb-2 flex size-14 items-center justify-center rounded-full"
					>
						<IconAlertTriangle className="text-destructive size-7" />
					</div>

					<CardTitle className="text-2xl">Something went wrong</CardTitle>

					<CardDescription className="max-w-md text-pretty">
						We couldn&apos;t complete your request. Try again, or return to a
						page that you know works.
					</CardDescription>
				</CardHeader>

				{import.meta.env.DEV && errorMessage && (
					<CardContent>
						<div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
							<div className="text-destructive mb-2 flex items-center gap-2 text-sm font-medium">
								<IconBug aria-hidden="true" className="size-4" />
								Development error
							</div>

							<p className="text-muted-foreground font-mono text-xs leading-relaxed wrap-break-word">
								{errorMessage}
							</p>

							{error instanceof Error && error.stack && (
								<details className="mt-3">
									<summary className="text-muted-foreground cursor-pointer text-xs font-medium">
										Show stack trace
									</summary>

									<pre className="bg-muted text-muted-foreground mt-2 max-h-64 overflow-auto rounded-md p-3 font-mono text-[11px] leading-relaxed wrap-break-word whitespace-pre-wrap">
										{error.stack}
									</pre>
								</details>
							)}
						</div>
					</CardContent>
				)}

				<CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
					<Button type="button" variant="outline" onClick={handleBack}>
						<IconArrowLeft aria-hidden="true" data-icon="inline-start" />
						Go back
					</Button>

					<Button type="button" onClick={handleRetry}>
						<IconRefresh aria-hidden="true" data-icon="inline-start" />
						Try again
					</Button>

					<Link className={buttonVariants({ variant: "outline" })} to="/">
						<IconHome aria-hidden="true" data-icon="inline-start" />
						Go home
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
};

export default ErrorComponent;
