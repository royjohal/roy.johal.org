"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Heading {
  id: string;
  text: string;
}

export function TableOfContents({ articleSelector = "article" }: { articleSelector?: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const suppressObserver = useRef(false);

  useEffect(() => {
    const article = document.querySelector(articleSelector);
    if (!article) return;

    const h2s = Array.from(article.querySelectorAll("h2")).filter((el) => el.id);
    setHeadings(h2s.map((el) => ({ id: el.id, text: el.textContent?.replace(/^#/, "").trim() ?? "" })));

    // Show TOC after article header scrolls out of view
    const header = article.querySelector("[data-id-header]");
    const sentinel = header ?? h2s[0];
    if (!sentinel) return;

    const showObserver = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    showObserver.observe(sentinel);

    // Active section tracking via scroll position
    const getActiveId = () => {
      const headerHeight = (document.querySelector("header")?.offsetHeight ?? 0) + 24;
      const scrollY = window.scrollY + headerHeight;
      let current = h2s[0]?.id ?? "";
      for (const el of h2s) {
        if (el.offsetTop <= scrollY) current = el.id;
        else break;
      }
      return current;
    };

    const onScroll = () => {
      if (suppressObserver.current) return;
      setActiveId(getActiveId());
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    setActiveId(getActiveId());

    return () => {
      showObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [articleSelector]);

  if (headings.length === 0) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    suppressObserver.current = true;
    setTimeout(() => { suppressObserver.current = false; }, 1000);
    const headerHeight = (document.querySelector("header")?.offsetHeight ?? 0) + 16;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop: fixed left panel */}
      <aside
        className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 w-52 z-40 transition-all duration-300 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <div className="bg-background border border-border p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 select-none">on this page</p>
          <nav>
            <ul className="space-y-1">
              {headings.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => scrollTo(h.id)}
                    className={`text-left w-full text-sm py-0.5 animation leading-snug ${
                      activeId === h.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-secondary-foreground"
                    }`}
                  >
                    {activeId === h.id && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground mr-2 mb-0.5" />
                    )}
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile: floating toggle button + drawer */}
      <div className={`lg:hidden fixed bottom-6 right-4 z-50 transition-all duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-2 bg-background border border-border p-4 w-56"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 select-none">on this page</p>
              <nav>
                <ul className="space-y-1">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <button
                        onClick={() => { scrollTo(h.id); setOpen(false); }}
                        className={`text-left w-full text-sm py-0.5 animation leading-snug ${
                          activeId === h.id
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-secondary-foreground"
                        }`}
                      >
                        {activeId === h.id && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground mr-2 mb-0.5" />
                        )}
                        {h.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-end">
          <button
            onClick={() => setOpen((o) => !o)}
            className="bg-background border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground animation select-none"
            aria-label="Toggle table of contents"
          >
            {open ? "✕ close" : "≡ contents"}
          </button>
        </div>
      </div>
    </>
  );
}
