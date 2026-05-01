export function ProductCardSkeleton() {
  return (
    <div className="bg-theme-card">
      <div className="aspect-[3/4] skeleton w-full" />
      <div className="p-4 border-t border-theme">
        <div className="skeleton h-3 w-16 mb-2 rounded" />
        <div className="skeleton h-4 w-3/4 mb-1 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-8 w-full mt-3 rounded" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="skeleton aspect-[3/4] md:aspect-auto min-h-[400px]" />
      <div className="p-12 flex flex-col gap-6">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-14 w-3/4 rounded" />
        <div className="skeleton h-8 w-24 rounded" />
        <div className="skeleton h-20 w-full rounded" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton w-11 h-11 rounded" />
          ))}
        </div>
        <div className="skeleton h-14 w-full rounded" />
      </div>
    </div>
  )
}
