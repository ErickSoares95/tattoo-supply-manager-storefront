import { fetchProducts } from "@/lib/api/products";
import { CatalogProductCard } from "@/components/shop/CatalogProductCard";

// Real data now (was lib/data/products.ts mock array + a client-side "Mais vendidos /
// Novidades" tab toggle before). Dropped the tabs along with the mock data: the real
// Product has no bestseller/isNew flag to filter by. "Destaques da loja" is now
// literally the top 5 real best-sellers (units sold across all orders, see
// ProductResponse.unitsSold) - same CatalogProductCard (and real "Adicionar ao
// carrinho") as /produtos.
export async function DestaquesSection() {
  const page = await fetchProducts({ sort: "bestselling", size: 5 });
  const list = page.content;

  return (
    <section id="destaques" aria-labelledby="destaques-title" className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.25em] text-gold">SELEÇÃO DA CASA</p>
        <h2 id="destaques-title" className="font-serif text-[30px] text-cream">Destaques da loja</h2>
      </div>

      {/* Mobile: horizontal swipe carousel (matches the original mockup's .card-grid
          behavior below 640px); sm+: back to the regular auto-fit grid. */}
      <p className="mb-3 text-center text-[12.5px] text-muted sm:hidden">← deslize para o lado para ver mais →</p>
      <div className="flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {list.length > 0 ? (
          list.map((product) => (
            <div key={product.id} className="w-[74%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-align-none">
              <CatalogProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhum produto cadastrado ainda.</p>
        )}
      </div>
    </section>
  );
}
