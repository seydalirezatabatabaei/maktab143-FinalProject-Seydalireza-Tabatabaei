import { Flame } from "lucide-react";

export default function LowStockNotice({
  quantity,
  compact = false,
}: {
  quantity: number;
  compact?: boolean;
}) {
  if (quantity < 1 || quantity >= 5) return null;

  return (
    <div
      role="status"
      className={compact
        ? "absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-xl border border-[#ff8811]/35 bg-[#fff8f0]/90 px-2 py-2 text-center text-xs font-bold text-[#392f5a] shadow-lg backdrop-blur-md"
        : "flex items-center gap-3 rounded-2xl border border-[#ff8811]/35 bg-gradient-to-l from-[#ff8811]/15 to-[#f4d06f]/30 px-4 py-3 text-sm font-semibold text-[#392f5a]"}
    >
      <Flame size={compact ? 15 : 19} className="shrink-0 fill-[#ff8811]/20 text-[#b85c00]" />
      <span>
        {compact ? `فقط ${quantity} عدد باقی مانده؛ زودتر بخر!` : `عجله کن! فقط ${quantity} عدد باقی مانده؛ زودتر بخر تا تمام نشده.`}
      </span>
    </div>
  );
}
