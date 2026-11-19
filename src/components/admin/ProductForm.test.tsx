import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ApiError } from "@/lib/api/client";
import type { ProductResponse } from "@/lib/api/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { fetchProductById, updateProductAdmin } from "@/lib/api/products";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/lib/store/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: true }) }));
vi.mock("@/lib/api/products", () => ({
  createProduct: vi.fn(),
  fetchProductById: vi.fn(),
  updateProductAdmin: vi.fn(),
}));

function product(overrides: Partial<ProductResponse> = {}): ProductResponse {
  return {
    id: 7,
    name: "Tinta Preta",
    description: null,
    price: 45.9,
    stock: 10,
    imageUrl: null,
    category: "INKS",
    onDeal: false,
    unitsSold: 0,
    version: 3,
    ...overrides,
  };
}

// Submits the form itself: jsdom's constraint validation is not what these tests are about.
function submit(saveButton: HTMLElement) {
  fireEvent.submit(saveButton.closest("form")!);
}

beforeEach(() => {
  vi.mocked(fetchProductById).mockResolvedValue(product());
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ProductForm (editing)", () => {
  it("sends back the version it loaded", async () => {
    vi.mocked(updateProductAdmin).mockResolvedValue(product({ version: 4 }));
    render(<ProductForm productId={7} />);

    submit(await screen.findByRole("button", { name: "Salvar" }));

    await waitFor(() => expect(updateProductAdmin).toHaveBeenCalledTimes(1));
    expect(vi.mocked(updateProductAdmin).mock.calls[0][0]).toBe(7);
    expect(vi.mocked(updateProductAdmin).mock.calls[0][2]).toBe(3);
  });

  it("on 409 explains the product changed and reloads it on demand", async () => {
    vi.mocked(updateProductAdmin).mockRejectedValue(new ApiError("Product 7 was modified", 409));
    render(<ProductForm productId={7} />);

    submit(await screen.findByRole("button", { name: "Salvar" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Este produto mudou");

    // Meanwhile an order sold 2 units: reloading shows the current stock and version.
    vi.mocked(fetchProductById).mockResolvedValue(product({ stock: 8, version: 4 }));
    fireEvent.click(screen.getByRole("button", { name: "Recarregar produto" }));

    await waitFor(() => expect(screen.queryByRole("button", { name: "Recarregar produto" })).toBeNull());
    expect(screen.queryByRole("alert")).toBeNull();
    expect((screen.getByDisplayValue("8") as HTMLInputElement).value).toBe("8");

    vi.mocked(updateProductAdmin).mockResolvedValue(product({ stock: 8, version: 5 }));
    submit(screen.getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(updateProductAdmin).toHaveBeenCalledTimes(2));
    expect(vi.mocked(updateProductAdmin).mock.calls[1][2]).toBe(4);
  });
});
