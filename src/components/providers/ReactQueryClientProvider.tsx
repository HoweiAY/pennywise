"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryClientProvider({ children }: { children: React.ReactNode }) {
  const [ queryClient, setQueryClient ] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
