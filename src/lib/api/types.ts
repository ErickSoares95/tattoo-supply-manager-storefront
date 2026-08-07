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

export type UserType = "ADMIN" | "CLIENT" | "ATTENDANT";

export interface LoginRequest {
  /** Accepts either email or CPF - see tattoo-supply-manager#031. */
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  userType: UserType;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string | null;
  cpf: string | null;
  imageUrl: string | null;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userStatus: "ACTIVE" | "BLOCKED";
  userType: UserType;
  phoneNumber: string | null;
  cpf: string | null;
  imageUrl: string | null;
  creationDate: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  items: OrderItemResponse[];
  total: number;
  creationDate: string;
}
