import Link from "next/link";
import { isLoggedIn, getUser } from "@/utils/config";
import NavbarClient from "@/comps/NavbarClient";

export default async function Navbar() {
    const loggedIn = await isLoggedIn();
    const user = await getUser();
    return (
        <NavbarClient loggedIn={loggedIn} name={user?.name ?? null} profileUrl={user?.profileUrl ?? null} />
    );
}
