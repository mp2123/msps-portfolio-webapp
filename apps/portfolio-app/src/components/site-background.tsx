'use client';

import { usePathname } from 'next/navigation';

export function SiteBackground() {
  const pathname = usePathname();

  if (pathname?.startsWith('/cv')) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_78%_18%,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,#020617,#060b16_48%,#020617)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025)_0,transparent_1px)] bg-[size:100%_26px] opacity-[0.12]" />
      <div className="absolute left-[8%] top-[14%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[6%] top-[28%] h-72 w-72 rounded-full bg-blue-500/8 blur-3xl" />
    </div>
  );
}
