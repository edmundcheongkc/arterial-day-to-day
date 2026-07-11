"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-xl font-semibold">Could not load items</h1>
        <p className="text-sm text-neutral-500">{error.message || "Something went wrong talking to the database."}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-md bg-neutral-900 text-white text-sm hover:bg-neutral-700"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
