const SkeletonLoader = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-gradient-to-r from-slate-500/10 via-slate-200/15 to-slate-500/10 ${className}`}
  />
);

export default SkeletonLoader;
