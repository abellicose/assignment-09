"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginWithGoogle from "@/comps/LoginWithGoogle";

export default function Login() {
    const [loggingIn, setLoggingIn] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");
    // password visibility
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {};
        const form = e.target;
        const errors = [];
        payload.email = form.email.value.trim();
        payload.password = form.password.value.trim();
        if (!payload.email.length) errors[0] = "Please enter your email";
        if (!payload.password.length) errors[1] = "Please enter your password";
        setErrors(errors);
        if (errors.length !== 0) return;
        setLoggingIn(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        setLoggingIn(false);
        if (!response.ok) {
            setError(data.message);
            return;
        }
        router.push("/");
        router.refresh();
    }

    function handleChange() {
        setErrors([]);
        setError("");
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-sm">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-ink tracking-tight mb-1">
                        Welcome back<span className="text-brand">.</span>
                    </h2>
                    <p className="text-sm text-ink-muted">Sign in to your SportNest account</p>
                </div>

                <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-ink-muted">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="email@example.com"
                            className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                        />
                        {errors[0] && <p className="text-xs text-red-400">{errors[0]}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-ink-muted">Password</label>
                        <div className="flex flex-col gap-1.5 relative">
                            <input
                                type={isVisible ? "text" : "password"}
                                id="password"
                                placeholder="enter your password"
                                className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                            />
                            <button type="button" onClick={() => setIsVisible(!isVisible)} className="ml-2 text-ink-subtle hover:text-ink transition-colors absolute top-2 right-2 cursor-pointer">
                                <Image src={`/icons/eye${isVisible?"closed":"open"}.svg`} alt="eye icon" width={25} height={25} />
                            </button>
                        </div>
                        {errors[1] && <p className="text-xs text-red-400">{errors[1]}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loggingIn}
                        className="mt-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-surface hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {loggingIn ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                    Don't have an account?{" "}
                    <a href="/register" className="text-brand hover:text-brand-light transition-colors">Register</a>
                    <LoginWithGoogle />
                </p>
                {error && (
                    <div className="mt-4 mb-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}
            </div>
        </main>
    );
}
