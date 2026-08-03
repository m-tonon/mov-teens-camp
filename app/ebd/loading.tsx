import { Skeleton } from '@/components/ui/skeleton';

export default function EbdLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}
