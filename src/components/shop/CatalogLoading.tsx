// Suspense fallback for ProductCatalog. The backend runs on Render's free tier, which sleeps
// after ~15 min idle and takes 30-50s to wake up, so the first catalog fetch can be slow:
// this keeps the rest of the page (header, hero) visible and says why it is waiting.
export function CatalogLoading() {
  return (
    <section aria-busy="true" className="mx-auto max-w-7xl px-5 py-14">
      <p className="text-xs font-semibold tracking-[0.25em] text-gold">CATÁLOGO COMPLETO</p>
      <p role="status" className="mt-2 text-[13.5px] text-muted">
        Carregando produtos… se a loja ficou um tempo parada, o servidor pode levar até 1 minuto para acordar.
      </p>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-[10px] border border-line bg-bg-card" />
        ))}
      </div>
    </section>
  );
}
