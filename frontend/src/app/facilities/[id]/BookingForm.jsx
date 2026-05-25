'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ slots, id }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        console.log("SUBMITTED");
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const payload = {
            facility_id: id,
            booking_date: new Date().toISOString().split("T")[0],
            time_slots: formData.getAll("slots")
        };
        const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings", {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        setLoading(false);
        const data = await resp.json();
        if (!resp.ok) {
            setError(data.message);
            return;
        }
        setSuccess(true);
        router.refresh();
    }

    function handleChange() { setError(""); }

    if (success) return (
        <div className="rounded-xl border border-surface-subtle bg-surface-muted px-5 py-6 text-center flex flex-col gap-3">
            <span className="text-3xl">✅</span>
            <p className="text-sm font-medium text-ink">Booking confirmed!</p>
            <p className="text-xs text-ink-muted">Check your bookings in your profile.</p>
            <a href="/profile/bookings" className="text-xs text-brand hover:text-brand-light transition-colors">View Bookings →</a>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-4">
            <div>
                <p className="text-sm font-medium text-ink-muted mb-2">Select Time Slots</p>
                <div className="grid grid-cols-2 gap-2">
                    {slots.map(slot => (
                        <label key={slot} className="flex items-center gap-2.5 rounded-lg border border-surface-subtle bg-surface px-3 py-2.5 cursor-pointer hover:border-brand transition-colors has-[:checked]:border-brand has-[:checked]:bg-surface-muted">
                            <input type="checkbox" name="slots" value={slot.toLowerCase()} className="accent-brand" />
                            <span className="text-sm text-ink">{slot}</span>
                        </label>
                    ))}
                </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-surface hover:bg-brand-light disabled:opacity-50 transition-colors"
            >
                {loading ? "Booking..." : "Book Now"}
            </button>
        </form>
    );
}
