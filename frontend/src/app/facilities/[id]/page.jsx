import { cookies } from "next/headers";

export default function FacilityPage({ params }) {
    const { id } = await params;
    const cookie = await cookies();
    const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities/" + id, {
        headers: {
            "Cookie": cookie.toString(),
        }
    });

    const data = await resp.json();

}
