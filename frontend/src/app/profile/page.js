import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/utils/config";

export default async function Profile() {
    const user = await getUser();
    return (
        <section className="flex flex-col gap-8">
            <div className="flex items-center gap-6 pb-8 border-b border-surface-subtle">
                <Image
                    src={user.profileUrl || "/icons/user.svg"}
                    alt={`Photo of ${user.name}`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover ring-2 ring-surface-subtle flex-shrink-0"
                />
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-ink tracking-tight">{user.name}</h2>
                    <p className="text-sm text-ink-muted">{user.email}</p>
                    <p className="text-xs text-ink-subtle">Member since {new Date(user.createdAt).getFullYear()}</p>
                </div>
            </div>
        </section>
    );
}
