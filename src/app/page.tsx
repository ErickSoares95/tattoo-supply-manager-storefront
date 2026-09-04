import { DestaquesSection } from "@/components/home/DestaquesSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OfertasSection } from "@/components/home/OfertasSection";

// Hero carousel + "Ofertas do dia"/"Destaques", both wired to the real catalog
// (OfertasSection/DestaquesSection are async Server Components that fetch from the
// Spring Boot API - no mock data left here, see lib/data/products.ts's removal).
export default function Home() {
  return (
    <>
      <HeroCarousel />
      <OfertasSection />
      <DestaquesSection />
    </>
  );
}
