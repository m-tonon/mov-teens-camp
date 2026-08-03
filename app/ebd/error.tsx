'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function EbdError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('EBD page error:', error);
  }, [error]);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <h2 className="text-lg font-semibold">Algo deu errado</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Não foi possível carregar a página da EBD. Tente novamente.
      </p>
      <Button
        type="button"
        className="cursor-pointer"
        onClick={() => reset()}
      >
        Tentar novamente
      </Button>
    </div>
  );
}
