"use client";

import { useEffect } from "react";

export function SuppressErrors() {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      if (
        event.message?.includes("ResizeObserver") &&
        event.message?.includes("undelivered notifications")
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handler, { capture: true });
    return () => window.removeEventListener("error", handler, { capture: true });
  }, []);

  return null;
}
