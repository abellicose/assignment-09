"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingCard({ booking }) {
    const [canceling, setCanceling] = useState(false);
    const router = useRouter();

    async function cancelBooking(id) {
        setCanceling(true);
        console.log("HI");
        const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/bookings/" + id, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({status: "Cancelled"})
        });
        console.log("HOLA");

        const dat = await resp.json();
        setCanceling(false);
        if (!resp.ok) {
            return;
        }
        router.refresh();
    }

    return (
        <article className={`relative bg-surface-muted border border-surface-subtle rounded-xl overflow-hidden flex flex-col sm:flex-row transition-opacity ${canceling ? "opacity-50 pointer-events-none" : ""}`}>
            {canceling && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/60 backdrop-blur-sm rounded-xl">
                    <p className="text-sm font-medium text-ink animate-pulse">Canceling booking...</p>
                </div>
            )}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div>
                    <h3 className="text-ink font-semibold text-base">{booking.facility_name}</h3>
                </div>
                <dl className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-xs text-ink-subtle">Total Price</dt>
                        <dd className="text-sm text-ink">{booking.total_price}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-xs text-ink-subtle">Hours</dt>
                        <dd className="text-sm text-ink">{booking.hours}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-xs text-ink-subtle">Status</dt>
                        <dd className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${booking.status === "Cancelled" ? "bg-red-950 text-red-400" : booking.status === "Pending" ? "bg-yellow-950 text-yellow-400" : "bg-green-950 text-green-400"}`}>{booking.status}</dd>
                    </div>
                </dl>
                <div>
                    <p className="text-xs text-ink-subtle mb-1.5">Chosen Slots</p>
                    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
                        {booking.time_slots.map(slot => (
                            <li key={slot} className="text-xs bg-surface-subtle text-ink-muted px-2 py-1 rounded-md">{slot}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-2 mt-auto pt-3 border-t border-surface-subtle">
                    <button
                        onClick={() => cancelBooking(booking._id)}
                        className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={booking.status === "Cancelled"}
                    >
                        {booking.status === "Cancelled" ? "Cancelled" : canceling ? "Canceling..." : "Cancel booking"}
                    </button>
                </div>
            </div>
        </article>
    );
}
