"use client";

import { useState } from "react";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

type Tab = "bestseller" | "new";

// Client Component (not the whole page) because only the tab toggle needs state -
// keeping that boundary tight is why HeroCarousel/DestaquesSection are client but
// OfertasSection/the rest of the page stay Server Components.
export function DestaquesSection() {
  const [tab, setTab] = useState<Tab>("bestseller");

  const list = (tab === "new" ? products.filter((p) => p.isNew) : products.filter((p) => p.bestseller)).slice(0, 4);

  return (
    <section id="destaques" aria-labelledby="destaques-title" className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-gold">SELEÇÃO DA CASA</p>
          <h2 id="destaques-title" className="font-serif text-[30px] text-cream">Destaques da loja</h2>
        </div>
        <div role="tablist" aria-label="Filtrar destaques" className="flex flex-wrap gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "bestseller"}
            onClick={() => setTab("bestseller")}
            className={`rounded-full border px-[18px] py-2 text-[13px] font-semibold ${
              tab === "bestseller" ? "border-gold bg-gold text-bg" : "border-line bg-bg-card text-muted"
            }`}
          >
            Mais vendidos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "new"}
            onClick={() => setTab("new")}
            className={`rounded-full border px-[18px] py-2 text-[13px] font-semibold ${
              tab === "new" ? "border-gold bg-gold text-bg" : "border-line bg-bg-card text-muted"
            }`}
          >
            Novidades
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
        {list.length > 0 ? (
          list.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-muted">Nenhum item nesta categoria ainda.</p>
        )}
      </div>
    </section>
  );
}
