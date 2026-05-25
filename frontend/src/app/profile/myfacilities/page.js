import FacilityCard from "@/app/profile/myfacilities/FacilityCard";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function MyFacilities() {
    const cookie = await cookies();
    console.log(cookie.toString());
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/facilities/mine", {
        headers: { "Cookie": cookie.toString() }
    });
    const data = await resp.json();
    const facilities = resp.ok ? data : [];

    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink">My Facilities</h2>
                <Link href="/profile/myfacilities/add" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                    + Add Facility
                </Link>
            </div>
            {facilities.length ? (
                <ul className="flex flex-col gap-4 list-none p-0 m-0">
                    {facilities.map(facility => (
                        <li key={facility._id}>
                            <FacilityCard facility={facility} />
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-surface-subtle rounded-xl">
                    <span className="text-4xl mb-4">🏟️</span>
                    <h3 className="text-sm font-semibold text-ink mb-1">No facilities yet</h3>
                    <p className="text-xs text-ink-muted mb-4">Add your first facility to start receiving bookings.</p>
                    <Link href="/profile/myfacilities/add" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                        Add Facility
                    </Link>
                </div>
            )}
        </section>
    );
}
