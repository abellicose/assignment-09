import Link from "next/link";
import Image from "next/image";

const steps = [
    { step: "01", title: "Find a Facility", desc: "Browse verified sports venues near you — courts, fields, and arenas." },
    { step: "02", title: "Pick a Slot", desc: "Choose your date, time, and duration. See real-time availability." },
    { step: "03", title: "Show Up & Play", desc: "Your booking is confirmed instantly. Just show up and play." },
];

const sports = [
    { name: "Football", emoji: "⚽" },
    { name: "Cricket", emoji: "🏏" },
    { name: "Basketball", emoji: "🏀" },
    { name: "Badminton", emoji: "🏸" },
    { name: "Tennis", emoji: "🎾" },
    { name: "Swimming", emoji: "🏊" },
];

export default async function Home() {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities");
    const facilities = (await response.json()).slice(0, 6);

    return (
        <main>
            <section className="flex flex-col items-center justify-center text-center min-h-[80vh] px-6">
                <h1 className="text-5xl md:text-7xl font-bold text-ink mb-6 tracking-tight">
                    Book Your <span className="text-brand">Court.</span><br />Play Your Game.
                </h1>
                <p className="text-ink-muted text-lg md:text-xl max-w-xl mb-10">
                    SportNest connects you with top-rated sports facilities nearby. Find, book, and get playing — all in one place.
                </p>
                <Link href="/facilities" className="rounded-md bg-brand px-8 py-3 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                    Explore Facilities
                </Link>
            </section>

            <section className="px-6 py-16 mx-auto max-w-6xl">
                <h2 className="text-3xl font-bold text-ink mb-10">Featured Facilities</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
                    {facilities.map(facility => (
                        <li key={facility._id}>
                            <article className="bg-surface-muted border border-surface-subtle rounded-xl overflow-hidden flex flex-col">
                                <Image src={facility.image} alt={facility.name} width={800} height={533} className="w-full h-48 object-cover" />
                                <div className="flex flex-col flex-1 gap-3 p-5">
                                    <h3 className="text-ink font-semibold text-lg leading-snug">{facility.name}</h3>
                                    <p className="text-ink-muted text-sm">{facility.location}</p>
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-subtle">
                                        <data value={facility.price_per_hour} className="text-brand font-semibold text-sm">
                                            <span className="text-xl leading-none me-1">৳</span>{facility.price_per_hour}/h
                                        </data>
                                        <data value={facility.capacity} className="text-ink-subtle text-xs">Capacity: {facility.capacity}</data>
                                    </div>
                                    <Link href={`/facilities/${facility._id}`} className="mt-2 text-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                                        Book Now
                                    </Link>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="px-6 py-16 border-t border-surface-subtle">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-ink mb-10">How It Works</h2>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0 m-0">
                        {steps.map(({ step, title, desc }) => (
                            <li key={step} className="flex flex-col gap-4">
                                <span className="text-5xl font-black text-brand opacity-80">{step}</span>
                                <h3 className="text-ink font-semibold text-lg">{title}</h3>
                                <p className="text-ink-muted text-sm leading-relaxed">{desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="px-6 py-16 border-t border-surface-subtle">
                <div className="mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-ink mb-10">Browse by Sport</h2>
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 list-none p-0 m-0">
                        {sports.map(({ name, emoji }) => (
                            <li key={name}>
                                <Link href={`/facilities?sport=${name.toLowerCase()}`} className="flex flex-col items-center gap-3 bg-surface-muted border border-surface-subtle rounded-xl py-6 hover:border-brand hover:text-brand transition-colors group">
                                    <span className="text-3xl">{emoji}</span>
                                    <span className="text-sm font-medium text-ink-muted group-hover:text-brand transition-colors">{name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
