"use client";
import Image from "next/image";
import Link from "next/link";

export default function Facility({ facility }) {
    return (
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
    );
}
