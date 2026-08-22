import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-6 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
        We couldn&rsquo;t find that page
      </h1>
      <p className="mt-4 max-w-md text-body">
        The page you&rsquo;re looking for may have moved. Here&rsquo;s where you can
        find what you need instead.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-canvas hover:opacity-90"
        >
          Back to Home
        </Link>
        <Link
          href="/practice-areas"
          className="rounded-full border border-hairline px-6 py-3 text-sm font-bold text-white hover:border-primary"
        >
          Practice Areas
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-hairline px-6 py-3 text-sm font-bold text-white hover:border-primary"
        >
          Get My Free Case Review
        </Link>
      </div>
    </div>
  );
}
