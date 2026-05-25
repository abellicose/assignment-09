"use client";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginWithGoogle from "@/comps/LoginWithGoogle";

const schema = z.object({
    name: z.string().min(1, "Please enter your name"),
    email: z.string().email("Invalid Email"),
    password: z.string().min(6, "Password Must be at least 6 Characters").regex(/[A-Z]/, "Need one uppercase").regex(/[a-z]/, "Need one lowercase"),
    profileUrl: z.string().url().optional().or(z.literal(""))
});

export default function Register() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const errors = [];
        const rawData = {};
        const form = e.target;
        for (const data of form) {
            if (data.type !== "submit") {
                rawData[data.name] = data.value;
            }
        }
        
        const result = schema.safeParse(rawData);
        if (!result.success) {
            const schemaErrors = result.error.flatten().fieldErrors;
            errors[0] = schemaErrors.name?.[0];
            errors[1] = schemaErrors.email?.[0];
            errors[2] = schemaErrors.password?.join(", ");
            setErrors(errors);
            return;
        }

        setIsRegistering(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result.data),
        });
        const data = await response.json();
        setIsRegistering(false);
        if (!response.ok) {
            setError(data.message);
            return;
        }
        setError("");
        setErrors([]);
        router.push("/");
        router.refresh();
    }

    function handleChange() {
        setErrors([]);
        setError("");
    }

    return (
        <main className="min-h-screen flex justify-center px-6 py-6">
            <div className="w-full max-w-sm">
                <div className={`mb-6 rounded-lg border px-4 py-3 transition-all ${error ? "border-red-800 bg-red-950" : "border-transparent"}`}>
                    <p className="text-sm text-red-400 min-h-[20px]">{error}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-ink tracking-tight mb-1">
                        Create account<span className="text-brand">.</span>
                    </h2>
                    <p className="text-sm text-ink-muted">Join SportNest and start booking</p>
                </div>

                <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col">

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-ink-muted">Full Name</label>
                        <input
                            name="name" id="name" type="text" placeholder="Enter your full name"
                            className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                        />
                        {<p className="text-xs text-red-400 min-h-5">{errors[0]}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-ink-muted">Email</label>
                        <input
                            name="email" id="email" type="email" placeholder="Enter your email"
                            className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                        />
                        {<p className="text-xs text-red-400 min-h-5">{errors[1]}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-ink-muted">Password</label>
                        <div className="flex flex-col gap-1.5 relative">
                            <input
                                type={isVisible ? "text" : "password"}
                                name="password"
                                id="password"
                                placeholder="enter your password"
                                className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                            />
                            <button type="button" onClick={() => setIsVisible(!isVisible)} className="ml-2 text-ink-subtle hover:text-ink transition-colors absolute top-2 right-2 cursor-pointer bg-white rounded-full px-[1px]">
                                <Image src={`/icons/eye${isVisible?"closed":"open"}.svg`} alt="eye icon" width={25} height={25} />
                            </button>
                        </div>
                        {<p className="text-xs text-red-400 min-h-5">{errors[2]}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="profileUrl" className="text-sm font-medium text-ink-muted">
                            Profile Picture URL <span className="text-ink-subtle">(Optional)</span>
                        </label>
                        <input
                            name="profileUrl" id="profileUrl" type="url" placeholder="https://example.com/image/..."
                            className="rounded-lg border border-surface-subtle bg-surface-muted px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors"
                        />
                        {<p className="text-xs text-red-400 min-h-5">{errors[3]}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isRegistering}
                        className="mt-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-surface hover:bg-brand-light disabled:opacity-50 transition-colors"
                    >
                        {isRegistering ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-muted">
                    Already have an account?{" "}
                    <a href="/login" className="text-brand hover:text-brand-light transition-colors">Login</a>
                    <LoginWithGoogle />
                </p>

            </div>
        </main>
    );
}
