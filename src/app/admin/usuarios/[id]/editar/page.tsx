import { UserForm } from "@/components/admin/UserForm";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="font-serif text-xl text-cream">Editar usuário</h2>
      <div className="mt-6">
        <UserForm userId={Number(id)} />
      </div>
    </div>
  );
}
