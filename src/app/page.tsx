import Link from "next/link";
import { getDemos } from "@/lib/demos";

export default function Home() {
  const demos = getDemos();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Demos</h1>
        <p className="text-zinc-500 text-sm mb-10">Proposal demos built for Upwork bids.</p>

        {demos.length === 0 ? (
          <p className="text-zinc-600 text-sm">No demos yet.</p>
        ) : (
          <ul className="space-y-3">
            {demos.map((demo) => (
              <li key={demo.slug}>
                <Link
                  href={`/demo/${demo.slug}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 px-4 py-3 hover:border-zinc-600 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{demo.title}</p>
                    {demo.description && (
                      <p className="text-zinc-500 text-xs mt-0.5">{demo.description}</p>
                    )}
                  </div>
                  <span className="text-zinc-600 text-xs">{demo.slug}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
