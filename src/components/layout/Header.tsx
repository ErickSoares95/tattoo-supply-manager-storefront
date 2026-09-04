import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { AccountButton } from "@/components/layout/AccountButton";
import { DepartmentMenu } from "@/components/layout/DepartmentMenu";
import { SearchIcon, WingLogo } from "@/components/ui/icons";
import { WishlistHeaderButton } from "@/components/shop/WishlistHeaderButton";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

// Server Component still - no "use client" needed (DepartmentMenu, the one interactive
// piece, is its own Client Component). The search box is a real <form action="/produtos">
// with plain GET inputs (name="name", name="category"): the browser turns that into a
// "/produtos?name=...&category=..." navigation on its own, no JS/client state required.
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
              name="category"
              aria-label="Departamento"
              className="border-r border-line bg-transparent px-3 py-2.5 text-[13px] text-muted outline-none"
              defaultValue=""
            >
              <option value="">Todos</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
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
        <nav aria-label="Categorias rápidas" className="mx-auto flex max-w-7xl items-center px-5 py-2 text-[13px]">
          {/* Destaques/Sobre/Contato/Ofertas do dia moved inside the dropdown itself
              (see DepartmentMenu) - the always-visible row didn't need to carry both
              the department list AND the page-anchor links at once. */}
          <DepartmentMenu />
        </nav>
      </div>
    </header>
  );
}
