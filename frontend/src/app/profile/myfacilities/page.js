export default async function MyFacilities() {
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities/mine");
    const data = await resp.json();
    let facilities = [];
    if (!resp.ok) {
        facilities = data;
    }

    return (
        <main>
            <h1>My Facilities</h1>
        </main>
    );
}
