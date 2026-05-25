"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// technically this should probably be received from the database
const sports = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Swimming"];

export default function Search({ sport }) {
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const query = form.search.value;
        const sport = form.sport.value;
        const params = new URLSearchParams();
        if (query) params.set("search", query);
        if (sport) params.set("sport", sport);
        router.push("/facilities?" + params.toString());
        router.refresh();
    }

    return (
        <section className="border-b border-surface-subtle bg-surface-muted px-6 py-8">
            <div className="mx-auto max-w-6xl">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        name="search" type="text" placeholder="Search facilities..."
                        className="flex-1 rounded-lg border border-surface-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                    />
                    <select
                        name="sport"
                        className="rounded-lg border border-surface-subtle bg-surface px-4 py-2.5 text-sm text-ink focus:border-brand focus:outline-none transition-colors"
                        defaultValue={sport || ""}
                    >
                        <option value="">All Sports</option>
                        {sports.map(cat => <option key={cat} value={cat.toLocaleLowerCase()}>{cat}</option>)}
                    </select>
                    <button
                        type="submit"
                        className="rounded-lg bg-brand px-6 py-2.5 text-sm font-medium text-surface hover:bg-brand-light transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
}
