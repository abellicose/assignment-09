export default function Loading() {
    return (
        <section className="px-6 py-12 mx-auto max-w-6xl animate-pulse">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
                {Array.from({ length: 6 }).map((value, i) => (
                    <li key={i}>
                        <div className="bg-surface-muted border border-surface-subtle rounded-xl overflow-hidden flex flex-col">
                            <div className="w-full h-48 bg-surface-subtle" />
                            <div className="flex flex-col gap-3 p-5">
                                <div className="h-5 w-3/4 rounded bg-surface-subtle" />
                                <div className="h-4 w-1/2 rounded bg-surface-subtle" />
                                <div className="flex justify-between mt-auto pt-3 border-t border-surface-subtle">
                                    <div className="h-4 w-16 rounded bg-surface-subtle" />
                                    <div className="h-4 w-20 rounded bg-surface-subtle" />
                                </div>
                                <div className="h-9 w-full rounded-md bg-surface-subtle" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
