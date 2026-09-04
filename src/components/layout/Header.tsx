import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { AccountButton } from "@/components/layout/AccountButton";
import { SearchIcon, WingLogo } from "@/components/ui/icons";
import { WishlistHeaderButton } from "@/components/shop/WishlistHeaderButton";

const DEPARTMENTS = [
  "Máquinas",
  "Agulhas",
  "Tintas",
  "Descartáveis",
  "Cuidados pós-tattoo",
  "Acessórios",
];

// Server Component still - no "use client" needed. The search box is a real <form
// action="/produtos"> with a plain GET input named "name": the browser turns that into
// a "/produtos?name=..." navigation on its own, no JS/client state required at all.
// The mega menu is still inert (department links have nowhere real to filter by - the
// real Product model has no category field, see docs/PLANO_REDESIGN.md).
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5">
        <Link href="/" aria-label="Vanessa Gazanez Tattoo — página inicial" className="flex shrink-0 items-center gap-3">
          <WingLogo className="h-[46px] w-[46px] text-gold" />
          {/* Name + subtitle only from sm up - at narrower widths the two icon groups
              either side already eat most of a 375px viewport, and stacking gold text
              inside a shrink-0 flex item just pushes total row width past the screen
              (real horizontal-scroll bug, not a hypothetical one - the wing icon alone
              keeps the link's accessible name via aria-label above). */}
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-[22px] font-bold tracking-wide text-gold-light whitespace-nowrap">
              Vanessa Gazanez
            </span>
            <span className="block text-[10.5px] tracking-[0.35em] text-muted">TATTOO SUPPLY</span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <form
            action="/produtos"
            role="search"
            className="hidden items-center overflow-hidden rounded-full border border-line bg-bg-card md:flex"
          >
            <label htmlFor="dept-select" className="visually-hidden">
              Selecionar departamento
            </label>
            <select
              id="dept-select"
              aria-label="Departamento"
              className="border-r border-line bg-transparent px-3 py-2.5 text-[13px] text-muted outline-none"
              defaultValue=""
            >
              <option value="">Todos</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
            <label htmlFor="search-input" className="visually-hidden">
              Buscar produtos
            </label>
            <input
              id="search-input"
              name="name"
              type="text"
              placeholder="Buscar máquinas, tintas, agulhas..."
              className="min-w-[220px] bg-transparent px-3 py-2.5 text-[13.5px] text-cream outline-none placeholder:text-muted"
            />
            <button type="submit" aria-label="Buscar" className="m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-bg">
              <SearchIcon />
            </button>
          </form>

          <AccountButton />
          <WishlistHeaderButton />
          <CartButton />
        </div>
      </div>

      {/* Mobile-only search row - the desktop form above is `hidden` below md, and
          without this there was no way at all to search on a phone (not degraded, just
          absent). No department select here on purpose: keeping it to a single input
          is what makes it fit next to nothing else competing for width. */}
      <form action="/produtos" role="search" className="border-t border-line px-5 py-2.5 md:hidden">
        <label htmlFor="search-input-mobile" className="visually-hidden">
          Buscar produtos
        </label>
        <div className="flex items-center overflow-hidden rounded-full border border-line bg-bg-card">
          <input
            id="search-input-mobile"
            name="name"
            type="text"
            placeholder="Buscar máquinas, tintas, agulhas..."
            className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-[13.5px] text-cream outline-none placeholder:text-muted"
          />
          <button type="submit" aria-label="Buscar" className="m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-bg">
            <SearchIcon />
          </button>
        </div>
      </form>

      <div className="border-t border-line">
        <nav aria-label="Categorias rápidas" className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2 text-[13px]">
          {/* A real <button aria-haspopup> promising a mega menu that never opens would
              be a false affordance for screen reader users - since there's no real
              menu to open (see the category note below), this is a plain link instead,
              consistent with the department links right after it. */}
          <Link
            href="/produtos"
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-semibold text-cream hover:border-gold"
          >
            ☰ Todos os Departamentos
          </Link>
          {/* Links to the unfiltered catalog, not to a real per-category filter - the
              actual Product model has no category field yet (see docs/PLANO_REDESIGN.md). */}
          {DEPARTMENTS.map((dept) => (
            <Link key={dept} href="/produtos" className="text-muted hover:text-gold-light">
              {dept}
            </Link>
          ))}
          <a href="#destaques" className="text-muted hover:text-gold-light">
            Destaques
          </a>
          <a href="#sobre" className="text-muted hover:text-gold-light">
            Sobre
          </a>
          <a href="#contato" className="text-muted hover:text-gold-light">
            Contato
          </a>
          <a href="#ofertas" className="font-semibold text-gold-light">
            Ofertas do dia
          </a>
        </nav>
      </div>
    </header>
  );
}
