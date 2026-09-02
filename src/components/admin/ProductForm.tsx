"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createProduct, fetchProductById, updateProductAdmin } from "@/lib/api/products";
import type { ProductPayload } from "@/lib/api/types";
import { useAuth } from "@/lib/store/AuthContext";
import { ProductImage } from "@/components/shop/ProductImage";

const EMPTY_FORM: ProductPayload = { name: "", description: "", price: 0, stock: 0, imageUrl: "" };

const FIELD_CLASS =
  "rounded-md border border-line bg-bg px-3 py-2 text-cream outline-none focus-visible:border-gold";

// Shared by /admin/produtos/novo and /admin/produtos/[id]/editar - same fields, same
// validation (mirrors ProductRequest/UpdateProductRequest on the backend, which are
// field-for-field identical), only the submit action and the initial load differ.
export function ProductForm({ productId }: { productId?: number }) {
  const isEditing = productId !== undefined;
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    fetchProductById(productId)
      .then((product) =>
        setForm({
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl ?? "",
        }),
      )
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o produto."))
      .finally(() => setLoading(false));
  }, [productId]);

  function handleChange(field: keyof ProductPayload) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "price" || field === "stock" ? Number(event.target.value) : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setSaving(true);
    try {
      if (isEditing) {
        await updateProductAdmin(productId, form, token);
      } else {
        await createProduct(form, token);
      }
      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível salvar o produto.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-muted">Carregando produto...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-muted">
        Nome
        <input required value={form.name} onChange={handleChange("name")} className={FIELD_CLASS} />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Descrição
        <textarea
          required
          minLength={10}
          maxLength={500}
          rows={3}
          value={form.description}
          onChange={handleChange("description")}
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Preço (R$)
        <input
          type="number"
          required
          min={0.01}
          step={0.01}
          value={form.price}
          onChange={handleChange("price")}
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Estoque
        <input
          type="number"
          required
          min={0}
          value={form.stock}
          onChange={handleChange("stock")}
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        URL da imagem
        <input
          type="url"
          placeholder="https://..."
          value={form.imageUrl ?? ""}
          onChange={handleChange("imageUrl")}
          className={FIELD_CLASS}
        />
      </label>

      {form.imageUrl && (
        <div className="w-40 overflow-hidden rounded-md border border-line">
          <ProductImage src={form.imageUrl} alt="Pré-visualização" />
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 self-start rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-bg hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
