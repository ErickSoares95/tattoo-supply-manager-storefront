// Mirrors the backend's actual DTOs (tattoo-supply-manager, product module) - only
// name/description/price/stock exist for real, unlike the mockup's richer product
// model (brand/category/rating/bestseller). See docs/PLANO_REDESIGN.md for the note
// on what's real vs. still mock-only decoration.
export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
}

// Spring Data's Page<T> JSON shape.
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-indexed
  size: number;
}
