import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h2 className="font-serif text-xl text-cream">Novo produto</h2>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
