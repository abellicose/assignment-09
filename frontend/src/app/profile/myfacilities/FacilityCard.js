"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FacilityCard({ facility }) {
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const router = useRouter();

    async function deleteFacility(id) {
        setDeleting(true);
        const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/facilities/" + id, {
            method: "DELETE",
            credentials: "include"
        });
        const dat = await resp.json();
        if (!resp.ok) {
            console.log(dat);
            setDeleting(false);
            return;
        }
        router.refresh();
    }

    return (
        <article className={`relative bg-surface-muted border border-surface-subtle rounded-xl overflow-hidden flex flex-col sm:flex-row transition-opacity ${deleting ? "opacity-50 pointer-events-none" : ""}`}>
            {deleting && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/60 backdrop-blur-sm rounded-xl">
                    <p className="text-sm font-medium text-ink animate-pulse">Removing facility...</p>
                </div>
            )}
            <div className="sm:w-48 flex-shrink-0">
                <Image src={facility.image} alt={facility.name} width={800} height={500} className="w-full h-40 sm:h-full object-cover" />
            </div>
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div>
                    <h3 className="text-ink font-semibold text-base">{facility.name}</h3>
                    <p className="text-ink-muted text-sm mt-1 line-clamp-2">{facility.description}</p>
                </div>
                <dl className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-xs text-ink-subtle">Type</dt>
                        <dd className="text-sm text-ink">{facility.facility_type}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <dt className="text-xs text-ink-subtle">Location</dt>
                        <dd className="text-sm text-ink">{facility.location}</dd>
                    </div>
                </dl>
                <div className="flex gap-4">
                    <data value={facility.capacity} className="text-xs text-ink-muted">Capacity: {facility.capacity}</data>
                    <data value={facility.price_per_hour} className="text-xs text-brand font-medium">৳{facility.price_per_hour}/hour</data>
                </div>
                <div>
                    <p className="text-xs text-ink-subtle mb-1.5">Available Slots</p>
                    <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
                        {facility.available_slots.map(slot => (
                            <li key={slot} className="text-xs bg-surface-subtle text-ink-muted px-2 py-1 rounded-md">{slot}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-2 mt-auto pt-3 border-t border-surface-subtle">
                    {confirmDelete ? (
                        <>
                            <p className="text-xs text-ink-muted self-center">Are you sure?</p>
                            <button
                                onClick={() => deleteFacility(facility._id)}
                                className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950 transition-colors"
                            >
                                {deleting ? "Removing..." : "Yes, remove"}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="rounded-md border border-surface-subtle px-3 py-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                            <button
                                onClick={() => setConfirmDelete(true)}
                                className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950 transition-colors"
                            >
                                Remove Facility
                            </button>
                        )}
                </div>            </div>
        </article>
    );
}
