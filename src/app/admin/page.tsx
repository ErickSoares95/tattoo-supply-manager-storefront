import Link from "next/link";

const SECTIONS = [
  {
    href: "/admin/produtos",
    title: "Produtos",
    description: "Criar, editar e remover produtos do catálogo.",
  },
  {
    href: "/admin/usuarios",
    title: "Usuários",
    description: "Gerenciar contas, promover ou bloquear usuários.",
  },
  {
    href: "/admin/notificacoes",
    title: "Notificações",
    description: "Reprocessar notificações de pedido que falharam.",
  },
];

export default function AdminHomePage() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SECTIONS.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className="rounded-lg border border-line bg-bg-card p-5 transition-colors hover:border-gold"
        >
          <h2 className="font-serif text-lg text-cream">{section.title}</h2>
          <p className="mt-1.5 text-sm text-muted">{section.description}</p>
        </Link>
      ))}
    </div>
  );
}
