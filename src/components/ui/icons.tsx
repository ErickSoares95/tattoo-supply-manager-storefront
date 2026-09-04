// Inline SVG icons ported from the mockup - kept as small components (not a sprite/icon
// font) so each one is tree-shakeable and can take a className like any other element,
// matching prompt.txt's plan of turning the mockup's raw SVGs into reusable components.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PinIcon(props: IconProps) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="12" height="9" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <circle cx="10" cy="10" r="6.5" />
      <line x1="15" y1="15" x2="20.5" y2="20.5" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2 4.5 5.5 4c2-.3 3.8.7 4.9 2.3.4.6 1.3.6 1.7 0C13.2 4.7 15 3.7 17 4c3.5.5 4.7 4 3 7.5C19 15.65 12 20 12 20z" />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

// Butterfly, replacing the original "wing" mark (2026-09-05, user's pick over a lion) -
// same minimal line-art style/100x100 viewBox as the mark it replaces, so it drops into
// Header at the same size/aspect ratio with no layout changes needed.
export function ButterflyLogo(props: IconProps) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true" {...props}>
      {/* body + antennae */}
      <circle cx="50" cy="24" r="3" fill="currentColor" />
      <path d="M50 27 L50 75" stroke="currentColor" strokeWidth="2" />
      <path d="M50 26 C46 18, 40 14, 34 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 26 C54 18, 60 14, 66 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* upper wings */}
      <path
        d="M49 33 C35 14, 10 14, 6 34 C10 49, 30 54, 49 45 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M51 33 C65 14, 90 14, 94 34 C90 49, 70 54, 51 45 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* lower wings */}
      <path
        d="M49 49 C40 54, 25 59, 22 71 C30 79, 42 75, 49 63 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M51 49 C60 54, 75 59, 78 71 C70 79, 58 75, 51 63 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
