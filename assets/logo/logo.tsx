
import { Package } from "lucide-react";

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-3 py-2 text-sm font-bold text-foreground">
      <span className="inline-flex size-9 items-center justify-center border border-primary text-primary">
        <Package size={19} aria-hidden="true" />
      </span>
      <span>فروشگاه فناوری</span>
    </span>
  );
}
