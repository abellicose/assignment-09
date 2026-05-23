"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarClient({ loggedIn, name, profileUrl }) {
    console.log("Navbar client");
    const [isLoggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setLoggingOut(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/logout", { method: "POST", credentials: "include" });
        const result = await response.json();
        setLoggingOut(false);
        if (!response.ok) {
            console.log(result.message);
            return;
        }
        router.refresh();
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-surface-subtle bg-surface/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">

                <h2 className="text-lg font-black tracking-tight text-ink" style={{ letterSpacing: "-0.03em" }}>
                    Sport<span className="text-brand">Nest</span>
                </h2>

                <nav>
                    <ul className="flex items-center gap-1 list-none m-0 p-0">
                        <li><Link href="/" className="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">Home</Link></li>
                        <li><Link href="/facilities" className="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">All Facilities</Link></li>
                        {loggedIn && (
                            <>
                                <li><Link href="/profile/bookings" className="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">My Bookings</Link></li>
                                <li><Link href="/profile/myfacilities" className="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">Manage My Facilities</Link></li>
                                <li><Link href="/profile/myfacilities/add" className="rounded-md px-3 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors">Add Facility</Link></li>
                            </>
                        )}
                    </ul>
                </nav>

                <div>
                    {loggedIn ? (
                        <div className="relative group">
                            <div className="flex items-center gap-2 cursor-pointer rounded-lg border border-surface-subtle px-2.5 py-1.5 hover:bg-surface-muted transition-colors">
                                <img src={profileUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                                <span className="text-sm font-medium text-ink">{name}</span>
                            </div>
                            <ul className="hidden group-hover:block absolute right-0 top-full w-52 rounded-xl border border-surface-subtle bg-surface p-1.5 list-none m-0">
                                <li className="flex items-center gap-2.5 px-3 py-2 border-b border-surface-subtle mb-1">
                                    <img src={profileUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                                    <span className="text-sm font-medium text-ink">{name}</span>
                                </li>
                                <li><Link href="/profile/bookings" className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-surface-muted">My Bookings</Link></li>
                                <li><Link href="/profile/myfacilities" className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-surface-muted">Manage My Facilities</Link></li>
                                <li><Link href="/profile/myfacilities/add" className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-surface-muted">Add Facility</Link></li>
                                <li className="mt-1 border-t border-surface-subtle pt-1">
                                    <button onClick={handleLogout} className="flex w-full rounded-md px-3 py-2 text-sm text-brand hover:bg-orange-50 disabled:opacity-50 cursor-pointer">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                            <Link href="/login" className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors">
                                Login
                            </Link>
                        )}
                </div>

            </div>
        </header>
    );
}
