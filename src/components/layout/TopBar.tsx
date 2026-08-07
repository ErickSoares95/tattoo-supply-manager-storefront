import { MailIcon, PinIcon, TruckIcon } from "@/components/ui/icons";

export function TopBar() {
  return (
    <div className="flex flex-wrap justify-center gap-6 bg-black px-5 py-1.5 text-[12.5px] tracking-wide text-muted">
      <span className="flex items-center gap-1.5">
        <PinIcon className="shrink-0 text-gold-dark" />
        Atendimento com hora marcada — Estúdio Vanessa Gazanez
      </span>
      <span className="flex items-center gap-1.5">
        <MailIcon className="shrink-0 text-gold-dark" />
        contato@vanessagazaneztattoo.com.br
      </span>
      <span className="flex items-center gap-1.5">
        <TruckIcon className="shrink-0 text-gold-dark" />
        Frete grátis acima de R$ 350
      </span>
    </div>
  );
}
