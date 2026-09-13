import { IconArrowLeft, IconHome, IconRouteOff } from "@tabler/icons-react";
import { Link, useRouter } from "@tanstack/react-router";
import type { NotFoundRouteProps } from "@tanstack/react-router";

import { Button, buttonVariants } from "../ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";

const NotFoundComponent = ({ routeId }: NotFoundRouteProps) => {
	const router = useRouter();

	const handleBack = () => {
		router.history.back();
	};

	return (
		<main className="flex min-h-dvh items-center justify-center px-4 py-10 shadow-md sm:px-6">
			<Card className="w-full max-w-lg">
				<CardHeader className="flex flex-col items-center text-center">
					<div
						aria-hidden="true"
						className="bg-muted mb-2 flex size-14 items-center justify-center rounded-full"
					>
						<IconRouteOff className="text-muted-foreground size-7" />
					</div>

					<p className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
						404
					</p>

					<CardTitle className="text-2xl">Page not found</CardTitle>

					<CardDescription className="max-w-md text-pretty">
						The page you&apos;re looking for doesn&apos;t exist, may have moved,
						or the address may be incorrect.
					</CardDescription>
				</CardHeader>

				{import.meta.env.DEV && (
					<div className="px-6 pb-2 text-center">
						<p className="text-muted-foreground text-xs">
							Route:{" "}
							<code className="bg-muted rounded px-1.5 py-0.5 font-mono text-black">
								{routeId}
							</code>
						</p>
					</div>
				)}

				<CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
					<Button type="button" variant="outline" onClick={handleBack}>
						<IconArrowLeft aria-hidden="true" data-icon="inline-start" />
						Go back
					</Button>

					<Link className={buttonVariants()} to="/">
						<IconHome aria-hidden="true" data-icon="inline-start" />
						Go home
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
};

export default NotFoundComponent;
