import { cookies } from "next/headers";

export async function isLoggedIn() {
    const cookie = await cookies();
    return cookie.has("token");
}

export async function getUser() {
    const cookie = await cookies();
    if (!cookie.has("token")) return;
    const user = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/me", {
        headers: {
            "Cookie": cookie.toString()
        }
    });
    return user.json();
}
