// Foundation step (1/6 of the redesign): layout shell + design tokens only, no page
// content yet on purpose. Hero carousel + "Ofertas do dia"/"Destaques" come in step 2.
export default function Home() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.3em] text-gold">ESTÚDIO &amp; TATTOO SUPPLY</p>
      <h1 className="max-w-2xl font-serif text-4xl font-bold text-cream sm:text-5xl">
        Equipamento profissional para quem <em className="text-gold-light">vive de tatuagem</em>
      </h1>
      <p className="max-w-xl text-muted">
        Redesign em andamento — fundação do layout (tokens, header, footer) pronta.
        Hero, catálogo e carrinho chegam nas próximas etapas.
      </p>
    </section>
  );
}
