import Link from "next/link";
import { BagIcon, HeartIcon, SearchIcon, UserIcon, WingLogo } from "@/components/ui/icons";

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
          <span className="leading-tight">
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

          <button type="button" aria-label="Minha conta" className="flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light">
            <UserIcon className="h-5 w-5" />
            <span className="visually-hidden">Conta</span>
          </button>
          <button type="button" aria-label="Lista de desejos" className="flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light">
            <HeartIcon className="h-5 w-5" />
            <span className="visually-hidden">Desejos</span>
          </button>
          <button type="button" aria-label="Abrir carrinho de compras" className="relative flex items-center justify-center rounded-full p-2 text-cream hover:bg-gold/10 hover:text-gold-light">
            <BagIcon className="h-5 w-5" />
            <span className="visually-hidden">Carrinho</span>
            <span aria-hidden className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-bg">
              0
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-line">
        <nav aria-label="Categorias rápidas" className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2 text-[13px]">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded="false"
            aria-label="Todos os departamentos"
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-semibold text-cream"
          >
            ☰ Todos os Departamentos
          </button>
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
