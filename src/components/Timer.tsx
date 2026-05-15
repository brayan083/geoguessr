"use client";

import { useEffect, useState } from "react";

interface Props {
  endsAt: number;
  onExpire?: () => void;
}

export function Timer({ endsAt, onExpire }: Props) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Math.floor((endsAt - Date.now()) / 1000)),
  );

  useEffect(() => {
    const id = setInterval(() => {
      const r = Math.max(0, Math.floor((endsAt - Date.now()) / 1000));
      setRemaining(r);
      if (r === 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 250);
    return () => clearInterval(id);
  }, [endsAt, onExpire]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const danger = remaining <= 10;

  return (
    <div
      className={`rounded-full px-4 py-2 font-mono text-lg font-bold tabular-nums ${
        danger
          ? "animate-pulse bg-red-600 text-white"
          : "bg-black/70 text-white"
      }`}
    >
      {mins}:{secs.toString().padStart(2, "0")}
    </div>
  );
}
