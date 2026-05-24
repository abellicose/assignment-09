import Sidebar from "@/app/profile/Sidebar";

export default function Layout({ children }) {
    return (
        <main className="min-h-screen px-6 py-12">
            <div className="mx-auto max-w-4xl flex gap-8">
                <Sidebar />
                <div className="flex-1 min-w-0">{children}</div>
            </div>
        </main>
    );
}
