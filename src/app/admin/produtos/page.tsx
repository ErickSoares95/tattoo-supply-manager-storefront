"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { deleteProduct, fetchAllProductsForAdmin } from "@/lib/api/products";
import type { ProductResponse } from "@/lib/api/types";
import { formatBRL } from "@/lib/format";
import { useAuth } from "@/lib/store/AuthContext";

export default function AdminProductsPage() {
  const { token } = useAuth();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllProductsForAdmin()
      .then((page) => setProducts(page.content))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar os produtos."))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(product: ProductResponse) {
    if (!token) return;
    if (!window.confirm(`Excluir "${product.name}"? Essa ação não pode ser desfeita.`)) return;

    setError(null);
    try {
      await deleteProduct(product.id, token);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível excluir o produto.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl text-cream">Produtos</h2>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg hover:bg-gold-light"
        >
          Novo produto
        </Link>
      </div>

      {loading && <p className="mt-4 text-muted">Carregando produtos...</p>}
      {error && <p className="mt-4 text-danger">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-card text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Estoque</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-line">
                  <td className="px-4 py-3 text-cream">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{formatBRL(product.price)}</td>
                  <td className="px-4 py-3 text-muted">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/produtos/${product.id}/editar`} className="text-gold-light hover:underline">
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-muted hover:text-danger"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
