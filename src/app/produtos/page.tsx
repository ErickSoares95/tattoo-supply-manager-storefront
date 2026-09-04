import type { Metadata } from "next";
import { ProductCatalog } from "@/components/shop/ProductCatalog";

export const metadata: Metadata = {
  title: "Todos os produtos — Vanessa Gazanez Tattoo Supply",
};

interface ProdutosPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

// Real catalog. Filters/sort/pagination all live in the URL, fetched here on the
// server - no client-side data fetching at all. Default sort (no ?sort= param) is
// "mais vendido primeiro" - see fetchProducts. The home page ("/") renders this same
// ProductCatalog block (variant="home") below its hero now too, so this route mostly
// exists for a clean, shareable /produtos?... URL rather than being the only way in.
export default async function ProdutosPage({ searchParams }: ProdutosPageProps) {
  const params = await searchParams;

  return <ProductCatalog searchParams={params} variant="standalone" />;
}
