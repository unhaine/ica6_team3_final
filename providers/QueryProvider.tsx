'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Mobile app-like behavior: avoid refetching immediately on window focus
            // to prevent jarring updates, unless explicitly needed.
            refetchOnWindowFocus: false, 
            staleTime: 60 * 1000, // 1 minute stale time
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
