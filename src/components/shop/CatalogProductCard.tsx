import type { ProductResponse } from "@/lib/api/types";
import { splitPrice } from "@/lib/format";
import { BagIcon } from "@/components/ui/icons";
import { ProductImagePlaceholder } from "@/components/shop/ProductImagePlaceholder";

// Leaner than shop/ProductCard.tsx on purpose: real ProductResponse only has
// name/description/price/stock, not the mockup's brand/rating/badges. Product page
// link (once /produto/[slug] exists in step 4) and "add to cart" wiring both land here later.
export function CatalogProductCard({ product }: { product: ProductResponse }) {
  const [priceInt, priceDecimal] = splitPrice(product.price);
  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-bg-card transition hover:-translate-y-[3px] hover:border-gold-dark">
      <ProductImagePlaceholder />
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <p className="min-h-[38px] text-[14.5px] font-semibold text-cream">{product.name}</p>
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

        <button
          type="button"
          disabled={!inStock}
          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-gold py-2.5 text-[13px] font-semibold text-gold-light hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold-light"
        >
          <BagIcon className="h-4 w-4" />
          {inStock ? "Adicionar ao carrinho" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
