import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

// Server Component: "deals" is just products with an oldPrice, no interactivity
// needed, so no reason to ship this to the client.
export function OfertasSection() {
  const deals = products.filter((p) => p.oldPrice !== null);

  return (
    <section id="ofertas" aria-labelledby="ofertas-title" className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">POR TEMPO LIMITADO</p>
          <h2 id="ofertas-title" className="font-serif text-[30px] text-cream">Ofertas do dia</h2>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <a href="#produtos" className="mt-5 block text-center text-[13.5px] font-semibold text-gold-light hover:underline">
        Ver todos os produtos →
      </a>
    </section>
  );
}
