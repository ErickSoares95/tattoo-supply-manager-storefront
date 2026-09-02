import { ProductImagePlaceholder } from "@/components/shop/ProductImagePlaceholder";

// Plain <img>, not next/image, on purpose: imageUrl is an admin-pasted URL from
// wherever they already host the photo (see ProductRequest.imageUrl on the backend) -
// domain unknown ahead of time. next/image requires an explicit remotePatterns
// allowlist per host, which would mean either a wildcard (defeats the allowlist's
// purpose) or editing next.config.ts every time a product uses a new image host.
export function ProductImage({
  src,
  alt,
  className = "h-[150px] w-full object-cover",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) return <ProductImagePlaceholder />;

  // eslint-disable-next-line @next/next/no-img-element -- see module comment above
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}
