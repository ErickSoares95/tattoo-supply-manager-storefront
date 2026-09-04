import { apiFetch } from "@/lib/api/client";
import type { ProductCategoryValue } from "@/lib/constants/categories";
import type { PageResponse, ProductPayload, ProductResponse } from "@/lib/api/types";

export const PAGE_SIZE = 20;

// No real "slug" field on the backend Product entity (only id/name/description/price/
// stock) - /produto/[id] uses the numeric id directly rather than adding a slug column
// just for this. A real SEO slug is a legitimate future improvement, not done here.
export function fetchProductById(id: number): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`, { cache: "no-store" });
}

export interface ProductQuery {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  category?: ProductCategoryValue;
  sort?: "bestselling" | "price-asc" | "price-desc" | "name-asc";
  page?: number;
  /** Overrides PAGE_SIZE - used by the admin product list, which wants "all of them
   * on one page" rather than the storefront catalog's 20-per-page grid. */
  size?: number;
}

// GET /products?name=&minPrice=&maxPrice=&minStock=&category=&page=&size=&sort= -
// matches ProductFilterRequest + Pageable exactly (see backend's ProductController).
export function fetchProducts(query: ProductQuery): Promise<PageResponse<ProductResponse>> {
  const params = new URLSearchParams();

  if (query.name) params.set("name", query.name);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.inStockOnly) params.set("minStock", "1");
  if (query.category) params.set("category", query.category);

  params.set("page", String(query.page ?? 0));
  params.set("size", String(query.size ?? PAGE_SIZE));

  // Default (no explicit sort choice) is "mais vendido primeiro" - unitsSold isn't a
  // real Product column, FindAllProductsService special-cases this sort key and
  // resolves it in memory instead of pushing it down to the database (see that
  // service's comment on why).
  if (query.sort === "price-asc") params.set("sort", "price,asc");
  else if (query.sort === "price-desc") params.set("sort", "price,desc");
  else if (query.sort === "name-asc") params.set("sort", "name,asc");
  else params.set("sort", "unitsSold,desc");

  return apiFetch<PageResponse<ProductResponse>>(`/products?${params.toString()}`, {
    // Product listings change often enough (stock, new items) that a static/cached
    // fetch would go stale fast - always hit the backend fresh for this one.
    cache: "no-store",
  });
}

// --- Admin CRUD (POST/PUT/DELETE /products/{id} are ADMIN-only on the backend; GET is
// public since tattoo-supply-manager#034, so listing for the admin table reuses
// fetchProducts above with a large page size instead of a separate endpoint). ---

export function fetchAllProductsForAdmin(): Promise<PageResponse<ProductResponse>> {
  return fetchProducts({ page: 0, size: 100, sort: "name-asc" });
}

export function createProduct(payload: ProductPayload, token: string): Promise<ProductResponse> {
  return apiFetch<ProductResponse>("/products", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function updateProductAdmin(id: number, payload: ProductPayload, token: string): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number, token: string): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
