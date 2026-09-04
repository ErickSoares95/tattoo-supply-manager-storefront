"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

// Real dropdown now that categories are a real Product field (ProductCategory on the
// backend) - was a plain link to /produtos before, on purpose (see git history):
// "a real aria-haspopup button promising a mega menu that never opens would be a false
// affordance". Simpler than the original mockup's mega-menu (no per-category avatars/
// brand columns - there's no real data to back those), but a real toggle now that there
// really is somewhere for it to go.
export function DepartmentMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="department-menu"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-semibold text-cream hover:border-gold"
      >
        ☰ Todos os Departamentos
      </button>

      {open && (
        <div
          id="department-menu"
          role="menu"
          aria-label="Departamentos"
          className="absolute top-full left-0 z-40 mt-2 w-64 rounded-lg border border-line bg-bg-card p-2 shadow-lg"
        >
          <ul className="flex flex-col">
            {PRODUCT_CATEGORIES.map((category) => (
              <li key={category.value} role="none">
                <Link
                  href={`/produtos?category=${category.value}`}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-muted hover:bg-gold/10 hover:text-gold-light"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/produtos"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-md border-t border-line px-3 pt-3 pb-2 text-sm font-semibold text-gold-light hover:underline"
          >
            Ver todos os produtos →
          </Link>
        </div>
      )}
    </div>
  );
}
