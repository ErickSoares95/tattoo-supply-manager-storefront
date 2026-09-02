import { ProductForm } from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="font-serif text-xl text-cream">Editar produto</h2>
      <div className="mt-6">
        <ProductForm productId={Number(id)} />
      </div>
    </div>
  );
}
