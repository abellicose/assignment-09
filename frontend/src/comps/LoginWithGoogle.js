export default function LoginWithGoogle() {
    return (
        <a
            href={process.env.NEXT_PUBLIC_API_URL + "/api/auth/google"}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm font-medium hover:bg-surface-subtle transition-colors mt-4">
            <span className="font-bold">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
            </span>
            <span className="text-ink">Continue with Google</span>
        </a>
    );
}
