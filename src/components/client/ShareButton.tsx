"use client";

import { useState, useCallback } from "react";
import { RiFileCopyLine, RiCheckLine } from "@remixicon/react";
import { AnimatePresence, motion } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }, [copied]);

  return (
    <div className="relative flex items-center gap-2">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleShare} aria-label="copy link" className="cursor-pointer group">
              {copied
                ? <RiCheckLine className="size-4 text-foreground" />
                : <RiFileCopyLine className="size-4 group-hover:text-foreground text-muted-foreground animation" />
              }
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>copy link to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, x: -4, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xs text-muted-foreground select-none"
          >
            link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
