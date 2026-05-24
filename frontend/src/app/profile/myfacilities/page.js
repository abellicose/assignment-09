export default async function MyFacilities() {
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities/mine");
    const data = await resp.json();
    let facilities = [];
    if (resp.ok) {
        facilities = data;
    }

    async function deleteFacility(id) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities/" + id);
    }

    return (
        <main>
            <h2>My Facilities</h2>
            <ul>
                {
                    facilities.length ? facilities.map(facility => (
                        <li key={facility._id}>
                            <article>
                                <Image src={facility.image} alt={facility.name} width={800} height={500} />
                                <h3>{facility.name}</h3>
                                <p>{facility.description}</p>

                                <dl>
                                    <div>
                                        <dt>Facility Type</dt>
                                        <dd>{facility.facility_type}</dd>
                                    </div>
                                    <div>
                                        <dt>Location</dt>
                                        <dd>{facility.location}</dd>
                                    </div>
                                </dl>

                                <div>
                                    <data value={facility.capacity}>Capacity: {facility.capacity}</data>
                                    <data value={facility.price_her_hour}>Price: ৳{facility.price_per_hour}/hour</data>
                                </div>

                                <div>
                                    <p>Available Slots</p>
                                    <ul>
                                        {
                                            facility.available_slots.map(slot => {
                                                <li>slot</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <button>Close This Offer</button>
                            </article>
                        </li>
                    )) : (<p>None found</p>)
                }
            </ul>
        </main>
    );
}
