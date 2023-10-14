'use client';

import { QueryClient, QueryClientProvider } from 'react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const queryClient = new QueryClient();

const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
