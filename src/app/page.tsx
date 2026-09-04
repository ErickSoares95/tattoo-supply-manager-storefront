import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCatalog } from "@/components/shop/ProductCatalog";

interface HomeProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

// Hero carousel + the full catalog right below it (2026-09-05, replacing the old fixed
// "Ofertas do dia"/"Destaques da loja" sections - see project-roadmap for why: with 28
// products and almost no real sales history yet, a flat top-N pick read as an arbitrary
// mix of unrelated categories instead of a curated selection). The home page IS the
// catalog now, filterable from the start ("Todas as categorias" by default) - /produtos
// still exists as its own route for a clean, shareable filtered URL.
export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <>
      <HeroCarousel />
      <ProductCatalog searchParams={params} variant="home" />
    </>
  );
}
