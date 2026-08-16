import type { ReactNode } from "react";
import { useScrollReveal } from "../controllers/useScrollReveal";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "fade" | "scale";
  className?: string;
}

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: Props) {
  const [ref, visible] = useScrollReveal();

  let transformStyles = "opacity-0 translate-y-8 scale-[0.98]";

  if (visible) {
    transformStyles = "opacity-100 translate-y-0 scale-100";
  } else {
    switch (direction) {
      case "up":
        transformStyles = "opacity-0 translate-y-10 scale-[0.97]";
        break;
      case "down":
        transformStyles = "opacity-0 -translate-y-10 scale-[0.97]";
        break;
      case "fade":
        transformStyles = "opacity-0 scale-100";
        break;
      case "scale":
        transformStyles = "opacity-0 scale-95 translate-y-4";
        break;
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${transformStyles} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
