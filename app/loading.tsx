export default function Loading() {
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse mb-8" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-neutral-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </main>
  );
}
