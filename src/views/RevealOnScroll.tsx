import type { ReactNode } from "react";
import { useScrollReveal } from "../controllers/useScrollReveal";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealOnScroll({ children, delay = 0, className = "" }: Props) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
