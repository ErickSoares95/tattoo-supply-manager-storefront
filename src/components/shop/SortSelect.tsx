"use client";

import { useRouter, useSearchParams } from "next/navigation";

// "" is the default (no explicit ?sort= in the URL) - fetchProducts resolves that to
// "mais vendido primeiro" server-side, so this list doesn't need its own separate
// "bestselling" entry that would just duplicate what "" already does.
const OPTIONS = [
  { value: "", label: "Mais vendidos" },
  { value: "price-asc", label: "Preço: menor para maior" },
  { value: "price-desc", label: "Preço: maior para menor" },
  { value: "name-asc", label: "Nome: A-Z" },
] as const;

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`/produtos?${params.toString()}`);
  }

  return (
    <select
      aria-label="Ordenar produtos"
      defaultValue={searchParams.get("sort") ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-line bg-bg-card px-3.5 py-2 text-[13px] text-cream outline-none focus-visible:border-gold"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
