import { fetchProducts } from "@/lib/api/products";
import { CatalogProductCard } from "@/components/shop/CatalogProductCard";

// Real data now (was lib/data/products.ts mock array before) - "on deal" is a real
// backend rule (Product.isOnDailyDeal: 3+ months since creationDate), not a fabricated
// discount. A product either qualifies or it doesn't; there's no oldPrice to show a
// "-14%" badge with, so this section is just the real catalog filtered down, same
// CatalogProductCard (and real "Adicionar ao carrinho") as /produtos.
export async function OfertasSection() {
  const page = await fetchProducts({ sort: "bestselling", size: 100 });
  const deals = page.content.filter((product) => product.onDeal);

  if (deals.length === 0) return null;

  return (
    <section id="ofertas" aria-labelledby="ofertas-title" className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">POR TEMPO LIMITADO</p>
          <h2 id="ofertas-title" className="font-serif text-[30px] text-cream">Ofertas do dia</h2>
        </div>
      </div>

      {/* Mobile: horizontal swipe carousel (matches the original mockup's .card-grid
          behavior below 640px); sm+: back to the regular auto-fit grid. */}
      <p className="mb-3 text-center text-[12.5px] text-muted sm:hidden">← deslize para o lado para ver mais →</p>
      <div className="flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {deals.map((product) => (
          <div key={product.id} className="w-[74%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none">
            <CatalogProductCard product={product} />
          </div>
        ))}
      </div>

      <a href="/produtos" className="mt-5 block text-center text-[13.5px] font-semibold text-gold-light hover:underline">
        Ver todos os produtos →
      </a>
    </section>
  );
}
