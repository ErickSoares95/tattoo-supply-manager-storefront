import { AccessibilityControls } from "@/components/layout/AccessibilityControls";

export function Footer() {
  return (
    <footer id="contato" className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div id="sobre">
          <h4 className="font-serif text-lg font-semibold text-gold-light">Vanessa Gazanez Tattoo</h4>
          <p className="mt-3 text-sm text-muted">
            Estúdio e tattoo supply especializado em equipamentos profissionais para
            tatuadores. Curadoria própria, feita por quem tatua.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram da Vanessa Gazanez Tattoo" className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:text-gold-light">
              IG
            </a>
            <a href="#" aria-label="WhatsApp da Vanessa Gazanez Tattoo" className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:text-gold-light">
              WA
            </a>
            <a href="#" aria-label="TikTok da Vanessa Gazanez Tattoo" className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:text-gold-light">
              TT
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-gold-light">Institucional</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><a href="#sobre" className="hover:text-gold-light">Sobre o estúdio</a></li>
            <li><a href="#" className="hover:text-gold-light">Nossa curadoria</a></li>
            <li><a href="#" className="hover:text-gold-light">Trabalhe conosco</a></li>
            <li><a href="#" className="hover:text-gold-light">Política de privacidade</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-gold-light">Ajuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><a href="#" className="hover:text-gold-light">Trocas e devoluções</a></li>
            <li><a href="#" className="hover:text-gold-light">Prazos de entrega</a></li>
            <li><a href="#" className="hover:text-gold-light">Formas de pagamento</a></li>
            <li><a href="#" className="hover:text-gold-light">Fale conosco</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-gold-light">Acessibilidade</h4>
          <AccessibilityControls />
          <p className="mt-3 text-xs text-muted">
            Site compatível com leitores de tela e navegação por teclado.
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-muted">
          <span>© 2026 Vanessa Gazanez Tattoo Supply. Todos os direitos reservados.</span>
          <div className="flex flex-wrap gap-2">
            {["Pix", "Cartão de crédito", "Cartão de débito", "Boleto"].map((method) => (
              <span key={method} className="rounded-full border border-line px-2.5 py-1">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
