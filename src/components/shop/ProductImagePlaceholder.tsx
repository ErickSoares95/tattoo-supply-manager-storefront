import { CameraIcon } from "@/components/ui/icons";

// No real product photos yet - where product data/images live for real is still an
// open decision (see the redesign plan), so this placeholder stands in until then.
export function ProductImagePlaceholder() {
  return (
    <div
      aria-hidden
      className="flex h-[150px] flex-col items-center justify-center gap-1.5 text-gold-dark"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--bg-card), var(--bg-card) 10px, var(--bg) 10px, var(--bg) 20px)",
      }}
    >
      <CameraIcon className="h-5 w-5 opacity-60" />
      <span className="font-mono text-[10px] tracking-wider text-muted uppercase">Foto do produto</span>
    </div>
  );
}
