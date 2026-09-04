import Link from "next/link";
import { fetchProducts } from "@/lib/api/products";
import type { ProductCategoryValue } from "@/lib/constants/categories";
import { CatalogProductCard } from "@/components/shop/CatalogProductCard";
import { FiltersPanel } from "@/components/shop/FiltersPanel";
import { Pagination } from "@/components/shop/Pagination";
import { SortSelect } from "@/components/shop/SortSelect";

interface ProductCatalogProps {
  searchParams: Record<string, string | undefined>;
  /** Home reuses this same catalog block below the hero (2026-09-05, replacing the old
   * fixed Destaques/Ofertas sections - see project-roadmap) instead of linking out to
   * /produtos, so it needs its own breadcrumb/heading treatment: no "Início › Todos os
   * produtos" breadcrumb (redundant, already home), and an <h2> instead of <h1> since
   * HeroCarousel's slide title is already the page's one real <h1>. /produtos itself
   * still renders both, being a standalone page with no hero above it. */
  variant?: "standalone" | "home";
}

// Shared by /produtos and / (home) - same filters/sort/pagination, all URL-driven and
// fetched server-side, just the surrounding chrome differs by variant.
export async function ProductCatalog({ searchParams: params, variant = "standalone" }: ProductCatalogProps) {
  const page = await fetchProducts({
    name: params.name,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStockOnly === "true",
    onDeal: params.onDeal === "true",
    category: params.category as ProductCategoryValue | undefined,
    sort: params.sort as "bestselling" | "price-asc" | "price-desc" | "name-asc" | undefined,
    page: params.page ? Number(params.page) : 0,
  });

  const Heading = variant === "home" ? "h2" : "h1";

  return (
    <section id="produtos" aria-labelledby="produtos-title" className="mx-auto max-w-7xl px-5 py-14">
      {variant === "standalone" && (
        <p className="mb-3.5 text-[12.5px] text-muted">
          <Link href="/" className="hover:text-gold-light">Início</Link>
          <span className="mx-1.5">›</span>
          <span>Todos os produtos</span>
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">CATÁLOGO COMPLETO</p>
          <Heading id="produtos-title" className="font-serif text-[30px] text-cream">Todos os produtos</Heading>
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

          <Pagination
            currentPage={page.number}
            totalPages={page.totalPages}
            searchParams={params}
            basePath={variant === "home" ? "/" : "/produtos"}
          />
        </div>
      </div>
    </section>
  );
}
