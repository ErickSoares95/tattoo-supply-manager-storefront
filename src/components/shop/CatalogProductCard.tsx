import Link from "next/link";
import type { ProductResponse } from "@/lib/api/types";
import { splitPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductImagePlaceholder } from "@/components/shop/ProductImagePlaceholder";

// Leaner than shop/ProductCard.tsx on purpose: real ProductResponse only has
// name/description/price/stock, not the mockup's brand/rating/badges.
export function CatalogProductCard({ product }: { product: ProductResponse }) {
  const [priceInt, priceDecimal] = splitPrice(product.price);
  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-bg-card transition hover:-translate-y-[3px] hover:border-gold-dark">
      <Link href={`/produto/${product.id}`} aria-label={product.name}>
        <ProductImagePlaceholder />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link href={`/produto/${product.id}`} className="min-h-[38px] text-[14.5px] font-semibold text-cream hover:text-gold-light">
          {product.name}
        </Link>
        {product.description && <p className="line-clamp-2 text-xs text-muted">{product.description}</p>}

        <div className="mt-auto flex items-baseline gap-2">
          <span>
            <span className="relative -top-1.5 text-xs">R$</span>
            <span className="text-[22px] font-bold text-gold-light">{priceInt}</span>
            <span className="relative -top-1.5 text-xs">,{priceDecimal}</span>
          </span>
        </div>

        {inStock ? (
          <span className="text-[11.5px] font-semibold text-ok">{product.stock} em estoque</span>
        ) : (
          <span className="text-[11.5px] font-bold text-danger">Fora de estoque</span>
        )}

        <AddToCartButton productId={product.id} name={product.name} price={product.price} inStock={inStock} />
      </div>
    </article>
  );
}
