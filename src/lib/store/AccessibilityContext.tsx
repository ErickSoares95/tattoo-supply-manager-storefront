"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Step 6/6 of the redesign (accessibility polish) shipped in two parts: part 1 was
// skip-link/focus-visible (baked into the foundation, step 1) plus the inert A+/A-/Alto
// contraste buttons in the footer. This is part 2 - the buttons actually do something now.
export type FontScale = "sm" | "base" | "lg";

const FONT_SCALE_ORDER: FontScale[] = ["sm", "base", "lg"];
const FONT_SCALE_PERCENT: Record<FontScale, string> = {
  sm: "87.5%",
  base: "100%",
  lg: "112.5%",
};

interface AccessibilityContextValue {
  fontScale: FontScale;
  highContrast: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);
const STORAGE_KEY = "a11y-prefs";

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  // Both start at the neutral default on the server and on first client render (avoids
  // a hydration mismatch, same reasoning as AuthContext/CartContext), then hydrate from
  // localStorage in the effect below, client-only.
  const [fontScale, setFontScale] = useState<FontScale>("base");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { fontScale?: FontScale; highContrast?: boolean };
      // Sanctioned exception, same as AuthContext's hydration effect: reading a
      // browser-only store that can't be read during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed.fontScale) setFontScale(parsed.fontScale);
      if (parsed.highContrast) setHighContrast(parsed.highContrast);
    } catch {
      // Malformed value from a previous version of this key - ignore and keep defaults.
    }
  }, []);

  useEffect(() => {
    // Scaling the root font-size cascades through every rem-based Tailwind utility
    // (text-sm, gap-4, p-3, ...) app-wide with zero changes to individual components -
    // this is the standard accessible way to do a font-size control, rather than
    // maintaining a parallel "large" variant of every size utility in the app.
    document.documentElement.style.fontSize = FONT_SCALE_PERCENT[fontScale];

    if (highContrast) {
      document.documentElement.setAttribute("data-contrast", "high");
    } else {
      document.documentElement.removeAttribute("data-contrast");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontScale, highContrast }));
  }, [fontScale, highContrast]);

  function increaseFontSize() {
    setFontScale((current) => {
      const nextIndex = Math.min(FONT_SCALE_ORDER.indexOf(current) + 1, FONT_SCALE_ORDER.length - 1);
      return FONT_SCALE_ORDER[nextIndex];
    });
  }

  function decreaseFontSize() {
    setFontScale((current) => {
      const nextIndex = Math.max(FONT_SCALE_ORDER.indexOf(current) - 1, 0);
      return FONT_SCALE_ORDER[nextIndex];
    });
  }

  function toggleHighContrast() {
    setHighContrast((current) => !current);
  }

  return (
    <AccessibilityContext.Provider
      value={{ fontScale, highContrast, increaseFontSize, decreaseFontSize, toggleHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
