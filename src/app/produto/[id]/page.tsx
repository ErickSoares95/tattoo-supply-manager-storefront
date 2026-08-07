import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchProductById } from "@/lib/api/products";
import { splitPrice } from "@/lib/format";
import { AddToCartForm } from "@/components/shop/AddToCartForm";
import { ProductImagePlaceholder } from "@/components/shop/ProductImagePlaceholder";

interface ProdutoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProdutoPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await fetchProductById(Number(id));
    return { title: `${product.name} — Vanessa Gazanez Tattoo Supply` };
  } catch {
    return { title: "Produto não encontrado" };
  }
}

// Step 4/6 of the redesign: /produto/[id] (uses the numeric id, not a real slug - see
// lib/api/products.ts) + AddToCartForm wired to the real cart (CartContext).
export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { id } = await params;

  let product;
  try {
    product = await fetchProductById(Number(id));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const inStock = product.stock > 0;
  const [priceInt, priceDecimal] = splitPrice(product.price);

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <p className="mb-6 text-[12.5px] text-muted">
        <Link href="/" className="hover:text-gold-light">Início</Link>
        <span className="mx-1.5">›</span>
        <Link href="/produtos" className="hover:text-gold-light">Todos os produtos</Link>
        <span className="mx-1.5">›</span>
        <span>{product.name}</span>
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[10px] border border-line">
          <ProductImagePlaceholder />
        </div>

        <div>
          <h1 className="font-serif text-[32px] text-cream">{product.name}</h1>

          {product.description && <p className="mt-3 text-[15px] text-muted">{product.description}</p>}

          <p className="mt-6">
            <span className="relative -top-2 text-sm">R$</span>
            <span className="text-4xl font-bold text-gold-light">{priceInt}</span>
            <span className="relative -top-2 text-sm">,{priceDecimal}</span>
          </p>

          {inStock ? (
            <p className="mt-2 text-sm font-semibold text-ok">✓ {product.stock} em estoque — Frete GRÁTIS</p>
          ) : (
            <p className="mt-2 text-sm font-bold text-danger">Fora de estoque</p>
          )}

          <div className="mt-6">
            <AddToCartForm productId={product.id} name={product.name} price={product.price} stock={product.stock} />
          </div>
        </div>
      </div>
    </section>
  );
}
