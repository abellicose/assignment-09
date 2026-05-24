'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const path = usePathname();
    const links = [
        { href: "/profile", label: "Overview" },
        { href: "/profile/bookings", label: "My Bookings" },
        { href: "/profile/myfacilities", label: "My Facilities" },
    ];
    return (
        <nav className="w-48 flex-shrink-0">
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                                path === href
                                    ? "bg-surface-muted text-ink font-medium border-l-2 border-brand"
                                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
