export default function Footer() {
    return (
        <footer className="bg-surface-muted border-t border-surface-subtle mt-auto">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <section className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-surface-subtle">
                    <div>
                        <h2 className="text-ink font-serif text-xl font-bold mb-3">
                            Sport<span className="text-brand">Nest</span>
                        </h2>
                        <p className="text-sm text-ink-muted">contact@sportnest.com</p>
                        <p className="text-sm text-ink-muted">Somewhere on earth</p>
                    </div>
                    <div>
                        <h3 className="text-ink text-sm font-medium mb-3">Follow Us</h3>
                        <ul className="flex flex-col gap-2 list-none p-0 m-0">
                            <li><a href="#" className="text-sm text-ink-muted hover:text-brand transition-colors">Facebook</a></li>
                            <li><a href="#" className="text-sm text-ink-muted hover:text-brand transition-colors">YouTube</a></li>
                            <li><a href="#" className="text-sm text-ink-muted hover:text-brand transition-colors">Instagram</a></li>
                        </ul>
                    </div>
                </section>
                <section className="pt-6">
                    <p className="text-xs text-ink-subtle">&copy; SportNest. All rights reserved.</p>
                </section>
            </div>
        </footer>
    );
}
