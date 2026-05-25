import BookingCard from "./BookingCard";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Bookings() {
    const cookie = await cookies();
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/bookings", {
        headers: { "Cookie": cookie.toString() }
    });
    const data = await resp.json();
    const bookings = resp.ok ? data : [];

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">My Bookings</h2>
            </div>
            {bookings.length ? (
                <ul className="flex flex-col gap-4 list-none p-0 m-0">
                    {bookings.map(booking => (
                        <li key={booking._id}>
                            <BookingCard booking={booking} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-surface-subtle rounded-xl">
                    <span className="text-4xl mb-4">🏟️</span>
                    <h3 className="text-sm font-semibold text-ink mb-1">No bookings yet</h3>
                    <p className="text-xs text-ink-muted mb-4">Book your first facility and enjoy!</p>
                </div>
            )}
        </section>
    );
}
