import type { Metadata } from "next";
import Link from "next/link";
import { fetchProducts } from "@/lib/api/products";
import { CatalogProductCard } from "@/components/shop/CatalogProductCard";
import { FiltersPanel } from "@/components/shop/FiltersPanel";
import { Pagination } from "@/components/shop/Pagination";
import { SortSelect } from "@/components/shop/SortSelect";

export const metadata: Metadata = {
  title: "Todos os produtos — Vanessa Gazanez Tattoo Supply",
};

interface ProdutosPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

// Step 3/6 of the redesign: real catalog, replacing lib/data/products.ts (mock, still
// used by the home page's Ofertas/Destaques sections). Filters/sort/pagination all
// live in the URL, fetched here on the server - no client-side data fetching at all.
export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const params = await searchParams;

  const page = await fetchProducts({
    name: params.name,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStockOnly === "true",
    sort: params.sort as "price-asc" | "price-desc" | "name-asc" | undefined,
    page: params.page ? Number(params.page) : 0,
  });

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <p className="mb-3.5 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-gold-light">Início</Link>
        <span className="mx-1.5">›</span>
        <span>Todos os produtos</span>
      </p>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">CATÁLOGO COMPLETO</p>
          <h1 className="font-serif text-[30px] text-cream">Todos os produtos</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-[30px] lg:grid-cols-[250px_1fr]">
        <FiltersPanel />

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-[13.5px] text-muted">
              {page.totalElements} {page.totalElements === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            <SortSelect />
          </div>

          {page.content.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
              {page.content.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-muted">Nenhum produto encontrado com esses filtros.</p>
          )}

          <Pagination currentPage={page.number} totalPages={page.totalPages} searchParams={params} />
        </div>
      </div>
    </section>
  );
}
