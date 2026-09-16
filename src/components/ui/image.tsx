import React from "react";

interface ImageLoaderParams {
	src: string;
	width: number;
	quality?: number;
}

export type ImageLoader = (params: ImageLoaderParams) => string;

export type ImageProps = Omit<
	React.ComponentPropsWithoutRef<"img">,
	"src" | "width" | "height" | "loading" | "referrerPolicy"
> & {
	src: string;
	alt: string;
	width?: number;
	height?: number;

	/**
	 * Make the image fill its containing block.
	 *
	 * The parent should normally have:
	 *
	 * `position: relative`
	 */
	fill?: boolean;

	/**
	 * Controls how the image fits when `fill` is enabled.
	 */
	objectFit?: React.CSSProperties["objectFit"];

	/**
	 * Controls the image's object position.
	 */
	objectPosition?: React.CSSProperties["objectPosition"];

	/**
	 * Responsive image sizes.
	 *
	 * Example:
	 * `(max-width: 768px) 100vw, 50vw`
	 */
	sizes?: string;

	/**
	 * Optional responsive widths.
	 *
	 * When supplied together with `loader`, a `srcSet` is generated.
	 */
	widths?: readonly number[];

	/**
	 * Optional image transformation function.
	 *
	 * This is where you connect Cloudinary, ImageKit, Imgix,
	 * Supabase Storage, a custom image server, etc.
	 */
	loader?: ImageLoader;

	/**
	 * Image quality passed to the loader.
	 */
	quality?: number;

	/**
	 * Skip responsive image generation.
	 */
	unoptimized?: boolean;

	/**
	 * Load the image eagerly and give it high fetch priority.
	 *
	 * Intended for above-the-fold / LCP images.
	 */
	priority?: boolean;

	/**
	 * Display a low-quality/blurred placeholder while the image loads.
	 *
	 * Requires `blurDataURL`.
	 */
	placeholder?: "empty" | "blur";

	/**
	 * Tiny image shown while the real image loads.
	 *
	 * Required when `placeholder="blur"`.
	 */
	blurDataURL?: string;

	/**
	 * Called after the image finishes loading.
	 */
	onLoadingComplete?: (img: HTMLImageElement) => void;

	/**
	 * Whether the image should be decoded asynchronously.
	 */
	decoding?: React.ImgHTMLAttributes<HTMLImageElement>["decoding"];

	/**
	 * Controls browser fetch priority.
	 */
	fetchPriority?: React.HTMLAttributeReferrerPolicy extends never
		? never
		: "high" | "low" | "auto";
};

const DEFAULT_WIDTHS = [
	320, 480, 640, 750, 828, 960, 1080, 1200, 1440, 1920, 2560, 3840,
] as const;

const identityLoader: ImageLoader = ({ src }) => src;

const buildSrcSet = (
	src: string,
	widths: readonly number[],
	loader: ImageLoader,
	quality?: number
) =>
	widths
		.map(
			(width) =>
				`${loader({
					src,
					width,
					quality,
				})} ${width}w`
		)
		.join(", ");

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
	(
		{
			src,
			alt,
			width,
			height,
			fill = false,
			objectFit,
			objectPosition,
			sizes,
			widths = DEFAULT_WIDTHS,
			loader,
			quality,
			unoptimized = false,
			priority = false,
			placeholder = "empty",
			blurDataURL,
			onLoadingComplete,
			onLoad,
			className,
			style,
			decoding = "async",
			fetchPriority,
			...rest
		},
		ref
	) => {
		const [loaded, setLoaded] = React.useState(false);

		/*
		 * Fail early during development rather than producing
		 * invalid image markup.
		 */
		if (!fill && (width === null || height === null)) {
			if (import.meta.env.DEV) {
				throw new Error(
					"Image: `width` and `height` are required unless `fill` is true."
				);
			}
		}

		if (fill && import.meta.env.DEV && (width !== null || height !== null)) {
			console.warn(
				"Image: `width` and `height` are ignored when `fill` is true."
			);
		}

		if (placeholder === "blur" && !blurDataURL) {
			if (import.meta.env.DEV) {
				throw new Error(
					'Image: `blurDataURL` is required when `placeholder="blur"`.'
				);
			}
		}

		const resolvedLoader = loader ?? identityLoader;

		const resolvedSrc = resolvedLoader({
			src,
			width: width ?? widths.at(-1)!,
			quality,
		});

		const srcSet =
			!unoptimized && loader
				? buildSrcSet(src, widths, loader, quality)
				: undefined;

		const resolvedFetchPriority = fetchPriority ?? (priority ? "high" : "auto");

		const resolvedLoading = priority ? "eager" : (rest.loading ?? "lazy");

		const imageStyle: React.CSSProperties = {
			...style,

			...(fill && {
				position: "absolute",
				inset: 0,
				width: "100%",
				height: "100%",
				objectFit: objectFit ?? "cover",
				objectPosition,
			}),

			...(placeholder === "blur" &&
				blurDataURL &&
				!loaded && {
					backgroundImage: `url("${blurDataURL}")`,
					backgroundSize: "cover",
					backgroundPosition: objectPosition ?? "center",
					backgroundRepeat: "no-repeat",
					filter: "blur(12px)",
					transform: "scale(1.02)",
				}),

			...(placeholder === "blur" &&
				blurDataURL &&
				loaded && {
					filter: undefined,
					transform: undefined,
					backgroundImage: undefined,
				}),
		};

		const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
			setLoaded(true);
			onLoad?.(event);

			if (onLoadingComplete) {
				onLoadingComplete(event.currentTarget);
			}
		};

		return (
			<img
				ref={ref}
				src={resolvedSrc}
				srcSet={srcSet}
				sizes={srcSet ? (sizes ?? (fill ? "100vw" : undefined)) : sizes}
				width={fill ? undefined : width}
				height={fill ? undefined : height}
				alt={alt}
				loading={resolvedLoading}
				decoding={decoding}
				fetchPriority={resolvedFetchPriority}
				className={className}
				style={imageStyle}
				onLoad={handleLoad}
				{...rest}
			/>
		);
	}
);

Image.displayName = "Image";
