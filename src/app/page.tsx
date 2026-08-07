import { DestaquesSection } from "@/components/home/DestaquesSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { OfertasSection } from "@/components/home/OfertasSection";

// Step 2/6 of the redesign: hero carousel + "Ofertas do dia"/"Destaques", mock data
// (src/lib/data/products.ts). Real catalog wiring is step 3.
export default function Home() {
  return (
    <>
      <HeroCarousel />
      <OfertasSection />
      <DestaquesSection />
    </>
  );
}
