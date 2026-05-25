import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-8xl font-black text-brand mb-4">404</h1>
            <h2 className="text-2xl font-bold text-ink mb-3">Page not found</h2>
            <p className="text-sm text-ink-muted max-w-sm mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                Back to Home
            </Link>
        </main>
    );
}
