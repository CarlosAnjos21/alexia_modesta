import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export function useScrollReveal(threshold = 0.12): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Atualiza a visibilidade dinamicamente ao rolar para baixo E para cima
        setVisible(entry.isIntersecting);
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
