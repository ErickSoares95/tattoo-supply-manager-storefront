"use client";

import { useAccessibility } from "@/lib/store/AccessibilityContext";

const BUTTON_CLASS = "rounded-full border border-line px-3 py-1.5 text-sm text-cream hover:border-gold";
const ACTIVE_BUTTON_CLASS = "rounded-full border border-gold bg-gold/10 px-3 py-1.5 text-sm text-gold-light";

// Pulled out of Footer (a Server Component) into its own Client Component, same reasoning
// as CartButton being pulled out of Header - only this small piece needs client state.
export function AccessibilityControls() {
  const { fontScale, highContrast, increaseFontSize, decreaseFontSize, toggleHighContrast } = useAccessibility();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        aria-label="Aumentar tamanho da fonte"
        disabled={fontScale === "lg"}
        onClick={increaseFontSize}
        className={`${BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        A+
      </button>
      <button
        type="button"
        aria-label="Diminuir tamanho da fonte"
        disabled={fontScale === "sm"}
        onClick={decreaseFontSize}
        className={`${BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        A-
      </button>
      <button
        type="button"
        aria-label="Alternar alto contraste"
        aria-pressed={highContrast}
        onClick={toggleHighContrast}
        className={highContrast ? ACTIVE_BUTTON_CLASS : BUTTON_CLASS}
      >
        Alto contraste
      </button>
    </div>
  );
}
