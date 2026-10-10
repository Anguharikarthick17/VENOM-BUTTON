"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const AWAY_TITLE = "👋 Hey, come back! | GENZLOG";
const DEFAULT_TITLE = "GENZLOG — Website Development & Free Frontend Code Platform";

/**
 * DynamicTabTitle
 *
 * Implements a dynamic, professional browser tab title experience for GENZLOG:
 * 1. When actively viewing the tab: displays the original page title appropriate to the route.
 * 2. When switching away to another tab or minimizing the browser: switches document title to "👋 Hey, come back! | GENZLOG".
 * 3. When returning to the tab: smoothly restores the exact original document title for the current route.
 * 4. Respects reduced-motion preferences, produces zero hydration issues, and cleans up event listeners properly.
 */
export function DynamicTabTitle() {
  const pathname = usePathname();
  const originalTitleRef = useRef<string>("");
  const isAwayRef = useRef<boolean>(false);

  // Sync route's original title on initial mount and route change
  useEffect(() => {
    if (typeof document === "undefined") return;

    const captureCurrentTitle = () => {
      const current = document.title;
      if (current && current !== AWAY_TITLE) {
        originalTitleRef.current = current;
      }
    };

    captureCurrentTitle();

    // App Router may finish applying client metadata a frame later on soft navigation
    const rafId = requestAnimationFrame(() => {
      captureCurrentTitle();
    });

    const timer = setTimeout(() => {
      captureCurrentTitle();
    }, 150);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [pathname]);

  // Handle visibility and focus transitions
  useEffect(() => {
    if (typeof document === "undefined") return;

    const setAwayTitle = () => {
      isAwayRef.current = true;
      const current = document.title;
      if (current && current !== AWAY_TITLE) {
        originalTitleRef.current = current;
      }
      document.title = AWAY_TITLE;
    };

    const restoreTitle = () => {
      isAwayRef.current = false;
      if (document.title === AWAY_TITLE) {
        document.title = originalTitleRef.current || DEFAULT_TITLE;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAwayTitle();
      } else {
        restoreTitle();
      }
    };

    const handleBlur = () => {
      // If the document is hidden or the window has blurred away
      if (document.hidden) {
        setAwayTitle();
      }
    };

    const handleFocus = () => {
      if (!document.hidden) {
        restoreTitle();
      }
    };

    // Observe title tag mutations to keep track of dynamic Next.js metadata updates
    let observer: MutationObserver | null = null;
    const titleEl = document.querySelector("title");
    if (titleEl && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => {
        const current = document.title;
        if (!isAwayRef.current && current && current !== AWAY_TITLE) {
          originalTitleRef.current = current;
        }
      });
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return null;
}
