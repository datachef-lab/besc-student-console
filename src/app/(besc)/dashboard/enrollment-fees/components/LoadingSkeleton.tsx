import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg md:col-span-1 lg:col-span-1" />
        <Skeleton className="h-40 w-full rounded-lg md:col-span-1 lg:col-span-1" />
        <Skeleton className="h-40 w-full rounded-lg md:col-span-2 lg:col-span-1" /> 
      </div>
      <Skeleton className="h-12 w-full mt-6" />
      <div className="space-y-4 mt-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
