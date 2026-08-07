import { apiFetch } from "@/lib/api/client";
import type { PageResponse, ProductResponse } from "@/lib/api/types";

export const PAGE_SIZE = 6;

export interface ProductQuery {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "price-asc" | "price-desc" | "name-asc";
  page?: number;
}

// GET /products?name=&minPrice=&maxPrice=&minStock=&page=&size=&sort= - matches
// ProductFilterRequest + Pageable exactly (see backend's ProductController).
export function fetchProducts(query: ProductQuery): Promise<PageResponse<ProductResponse>> {
  const params = new URLSearchParams();

  if (query.name) params.set("name", query.name);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.inStockOnly) params.set("minStock", "1");

  params.set("page", String(query.page ?? 0));
  params.set("size", String(PAGE_SIZE));

  if (query.sort === "price-asc") params.set("sort", "price,asc");
  if (query.sort === "price-desc") params.set("sort", "price,desc");
  if (query.sort === "name-asc") params.set("sort", "name,asc");

  return apiFetch<PageResponse<ProductResponse>>(`/products?${params.toString()}`, {
    // Product listings change often enough (stock, new items) that a static/cached
    // fetch would go stale fast - always hit the backend fresh for this one.
    cache: "no-store",
  });
}
