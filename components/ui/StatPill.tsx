interface StatPillProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatPill({ label, value, accent = "text-cyan-200" }: StatPillProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-center shadow-inner shadow-white/5">
      <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/50">{label}</div>
      <div className={`text-sm font-black sm:text-base ${accent}`}>{value}</div>
    </div>
  );
}
