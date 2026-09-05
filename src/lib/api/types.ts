import type { ProductCategoryValue } from "@/lib/constants/categories";

// Mirrors the backend's actual DTOs (tattoo-supply-manager, product module).
export interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  /** Nullable - products created before this field existed stay null until an admin
   * backfills them (same one-time gap imageUrl had). */
  category: ProductCategoryValue | null;
  /** True once the product has been in the catalog for 3+ months (see Product.
   * isOnDailyDeal on the backend) - drives "Ofertas do dia" on the home page. No
   * oldPrice/discount field exists; this only decides which real products show up
   * there, it doesn't fabricate a price cut. */
  onDeal: boolean;
  /** Total quantity sold across ALL orders, regardless of payment status (see
   * ProductResponse.unitsSold on the backend - deliberately not the same "sales"
   * concept as the admin sales report, which requires an approved payment). Drives
   * "mais vendido" ordering on /produtos and "Destaques da loja" on the home page. */
  unitsSold: number;
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
export type UserStatus = "ACTIVE" | "BLOCKED";

// Same shape for create and update on the backend (ProductRequest/UpdateProductRequest
// are two records but field-for-field identical) - one payload type covers both here.
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: ProductCategoryValue | null;
}

// Matches UpdateUserRequest exactly - admin edits go through PUT /users/{id}, a full
// replacement (not a patch), so every field the backend requires has to be sent even
// when only one of them actually changed.
export interface UpdateUserRequest {
  username: string;
  fullName: string;
  phoneNumber: string | null;
  cpf: string | null;
  imageUrl: string | null;
  userType: UserType;
  userStatus: UserStatus;
}

// Matches UpdateProfileRequest exactly - the self-service counterpart to
// UpdateUserRequest, used by PUT /users/me. No userType/userStatus fields exist here on
// purpose: a client editing their own profile can never grant themselves a role or
// unblock their own account through this payload.
export interface UpdateProfileRequest {
  username: string;
  fullName: string;
  phoneNumber: string | null;
  cpf: string | null;
  imageUrl: string | null;
}

// Matches ChangePasswordRequest exactly - PATCH /users/me/password.
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

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
  userStatus: UserStatus;
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

// Mirrors the payment module (tattoo-supply-manager). Approval is deterministic on the
// backend: APPROVED only when the paid amount equals the order total exactly, REJECTED
// otherwise (no real gateway). The storefront always pays the exact total, so from here
// a payment is effectively always APPROVED - REJECTED is still handled in the UI for
// completeness (e.g. an admin paying a wrong amount via Postman).
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO";

// Matches PaymentRequest exactly - POST /orders/{orderId}/payments.
export interface PaymentRequest {
  amount: number;
  method: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  creationDate: string;
}
