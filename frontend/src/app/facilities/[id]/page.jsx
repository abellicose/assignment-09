import { cookies } from "next/headers";
import Image from "next/image";
import BookingForm from "./BookingForm";

export default async function FacilityPage({ params }) {
    const { id } = await params;
    const cookie = await cookies();
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities/" + id, {
        headers: { "Cookie": cookie.toString() }
    });
    if (!resp.ok) return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-ink-muted text-sm">Facility not found.</p>
        </main>
    );
    const data = await resp.json();

    return (
        <main className="min-h-screen px-6 py-12">
            <div className="mx-auto max-w-5xl">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="rounded-xl overflow-hidden border border-surface-subtle">
                        <Image src={data.image} alt={data.name} width={800} height={550} className="w-full h-72 lg:h-full object-cover" />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-ink tracking-tight mb-2">{data.name}</h2>
                            <p className="text-sm text-ink-muted leading-relaxed">{data.description}</p>
                        </div>

                        <dl className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Sport", value: data.facility_type },
                                { label: "Location", value: data.location },
                                { label: "Price/Hour", value: `৳${data.price_per_hour}` },
                                { label: "Capacity", value: data.capacity },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-0.5 bg-surface-muted rounded-lg px-4 py-3 border border-surface-subtle">
                                    <dt className="text-xs text-ink-subtle">{label}</dt>
                                    <dd className="text-sm font-medium text-ink">{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <BookingForm slots={data.available_slots} id={data._id} />
                    </div>
                </section>
            </div>
        </main>
    );
}
