import Facility from "@/comps/Facility";

export default async function List({ search, sport }) {
    const urlparams = new URLSearchParams();
    if (search) urlparams.set("search", search);
    if (sport) urlparams.set("sport", sport);

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/facilities?" + urlparams.toString());
    let facilities = [];
    if (response.ok) {
        const data = await response.json();
        facilities = data;
    }

    return (
        <section className="px-6 py-12 mx-auto max-w-6xl">
            {facilities.length ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
                    {facilities.map(facility => (
                        <li key={facility._id}>
                            <Facility facility={facility} />
                        </li>
                    ))}
                </ul>
            ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <span className="text-5xl mb-4">🏟️</span>
                        <h3 className="text-lg font-semibold text-ink mb-2">No facilities found</h3>
                        <p className="text-sm text-ink-muted max-w-xs">Try adjusting your search or clearing the filters to see all available facilities.</p>
                    </div>
                )}
        </section>
    );
}
