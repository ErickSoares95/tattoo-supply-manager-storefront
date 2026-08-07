import Link from "next/link";

interface PaginationProps {
  currentPage: number; // 0-indexed, matches Spring's Page.number
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

function buildHref(searchParams: PaginationProps["searchParams"], page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 0) params.set("page", String(page));
  const query = params.toString();
  return `/produtos${query ? `?${query}` : ""}`;
}

// Server Component: page links are plain <a>/<Link>, no client state needed - the
// server-rendered produtos/page.tsx already knows the current page from searchParams.
export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginação de produtos" className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(searchParams, Math.max(0, currentPage - 1))}
        aria-disabled={currentPage === 0}
        className={`rounded-full border border-line px-3.5 py-1.5 text-sm ${
          currentPage === 0 ? "pointer-events-none opacity-35" : "text-cream hover:border-gold hover:text-gold-light"
        }`}
      >
        ‹ Anterior
      </Link>

      <span className="px-2 text-sm text-muted">
        Página {currentPage + 1} de {totalPages}
      </span>

      <Link
        href={buildHref(searchParams, Math.min(totalPages - 1, currentPage + 1))}
        aria-disabled={currentPage >= totalPages - 1}
        className={`rounded-full border border-line px-3.5 py-1.5 text-sm ${
          currentPage >= totalPages - 1
            ? "pointer-events-none opacity-35"
            : "text-cream hover:border-gold hover:text-gold-light"
        }`}
      >
        Próxima ›
      </Link>
    </nav>
  );
}
