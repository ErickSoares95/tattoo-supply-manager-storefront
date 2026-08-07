import type { Product } from "@/lib/data/products";
import { discountPercent, splitPrice, stars } from "@/lib/format";
import { BagIcon, HeartIcon } from "@/components/ui/icons";
import { ProductImagePlaceholder } from "@/components/shop/ProductImagePlaceholder";

// Presentational only for now - wishlist and "add to cart" have no real state/click
// handlers yet (that's step 4, once a real cart exists to add to). The card itself,
// and choosing what data it needs, is this step's job.
export function ProductCard({ product }: { product: Product }) {
  const [priceInt, priceDecimal] = splitPrice(product.price);
  const discount = product.oldPrice ? discountPercent(product.price, product.oldPrice) : null;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[10px] border border-line bg-bg-card transition hover:-translate-y-[3px] hover:border-gold-dark">
      {product.bestseller ? (
        <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-gold px-2.5 py-1 text-[10.5px] font-bold text-bg">
          Mais vendido
        </span>
      ) : product.isNew ? (
        <span className="absolute top-2.5 left-2.5 z-10 rounded-full border border-gold px-2.5 py-1 text-[10.5px] font-bold text-gold-light">
          Novo
        </span>
      ) : null}

      <button
        type="button"
        aria-label={`Adicionar ${product.name} à lista de desejos`}
        aria-pressed="false"
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-black/50 text-cream hover:border-gold hover:text-gold-light"
      >
        <HeartIcon className="h-4 w-4 fill-transparent" />
      </button>

      <ProductImagePlaceholder />

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="text-xs tracking-wide text-muted uppercase">{product.brand}</span>
        <p className="min-h-[38px] text-[14.5px] font-semibold text-cream">{product.name}</p>

        <div className="flex items-center gap-1.5 text-[12.5px] text-muted">
          <span aria-hidden className="text-gold">{stars(product.rating)}</span>
          <span className="text-[12.5px] text-gold-light">{product.reviews} avaliações</span>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          {discount !== null && (
            <span className="rounded bg-danger px-1.5 py-0.5 text-[11px] font-bold text-white">-{discount}%</span>
          )}
          <span>
            <span className="relative -top-1.5 text-xs">R$</span>
            <span className="text-[22px] font-bold text-gold-light">{priceInt}</span>
            <span className="relative -top-1.5 text-xs">,{priceDecimal}</span>
          </span>
          {product.oldPrice && (
            <span className="text-[12.5px] text-muted line-through">{splitPrice(product.oldPrice).join(",")}</span>
          )}
        </div>

        {product.inStock ? (
          <div>
            <span className="block text-[11.5px] font-semibold text-ok">✓ Frete GRÁTIS</span>
            <span className="block text-[11.5px] text-muted">Chegará amanhã, se pedir em 2h</span>
          </div>
        ) : (
          <span className="text-[11.5px] font-bold text-danger">Fora de estoque</span>
        )}

        <span className="text-[12.5px] text-muted">até 3x sem juros</span>

        <button
          type="button"
          disabled={!product.inStock}
          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-gold py-2.5 text-[13px] font-semibold text-gold-light hover:bg-gold hover:text-bg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold-light"
        >
          <BagIcon className="h-4 w-4" />
          {product.inStock ? "Adicionar ao carrinho" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
