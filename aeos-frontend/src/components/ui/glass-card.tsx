import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] bg-white border border-slate-200 shadow-sm p-6",
        hover && "hover:shadow-md hover:border-blue-200 transition-all cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
