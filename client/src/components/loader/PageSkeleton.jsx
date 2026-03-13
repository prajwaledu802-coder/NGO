import SkeletonLoader from './SkeletonLoader';

const PageSkeleton = () => (
  <section className="space-y-4">
    <SkeletonLoader className="h-20 w-full" />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SkeletonLoader className="h-32 w-full" />
      <SkeletonLoader className="h-32 w-full" />
      <SkeletonLoader className="h-32 w-full" />
      <SkeletonLoader className="h-32 w-full" />
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      <SkeletonLoader className="h-72 w-full" />
      <SkeletonLoader className="h-72 w-full" />
    </div>
  </section>
);

export default PageSkeleton;
