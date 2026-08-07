"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

// URL search params are the source of truth (not local-only state) so filters are
// shareable/bookmarkable and the actual fetch happens server-side in produtos/page.tsx -
// this component only ever navigates, it never fetches.
export function FiltersPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    const next = { name, minPrice, maxPrice, ...overrides };

    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // any filter change resets pagination
    router.push(`/produtos?${params.toString()}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    navigate({});
  }

  function toggleInStock(checked: boolean) {
    navigate({ inStockOnly: checked ? "true" : "" });
  }

  return (
    <aside aria-label="Filtros de produtos" className="rounded-lg border border-line bg-bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold tracking-[0.1em] text-gold uppercase">Filtrar</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="border-b border-line pb-4">
          <legend className="mb-2 text-[13px] font-semibold text-cream">Buscar</legend>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome ou descrição..."
            className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-cream outline-none placeholder:text-muted focus-visible:border-gold"
          />
        </fieldset>

        <fieldset className="border-b border-line pb-4">
          <legend className="mb-2 text-[13px] font-semibold text-cream">Preço</legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Mín"
              aria-label="Preço mínimo"
              className="w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-cream outline-none placeholder:text-muted focus-visible:border-gold"
            />
            <span className="text-muted">–</span>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Máx"
              aria-label="Preço máximo"
              className="w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-cream outline-none placeholder:text-muted focus-visible:border-gold"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-[13px] font-semibold text-cream">Disponibilidade</legend>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              defaultChecked={searchParams.get("inStockOnly") === "true"}
              onChange={(e) => toggleInStock(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Somente em estoque
          </label>
        </fieldset>

        <button
          type="submit"
          className="rounded-full bg-gold py-2.5 text-sm font-semibold text-bg hover:bg-gold-light"
        >
          Aplicar filtros
        </button>
      </form>
    </aside>
  );
}
