"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current year only after mounting to prevent hydration mismatch.
 */
export function ClientYear() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <span>© {new Date().getFullYear()} Vyoma. All rights reserved.</span>;
}
