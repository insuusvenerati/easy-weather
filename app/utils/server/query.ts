import { QueryClient } from "@tanstack/query-core";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

export default createQueryClient;
