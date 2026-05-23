"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
    const [loggingIn, setLoggingIn] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");
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
        if (errors.length !== 0) return

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            setError(data.message);
            return;
        }
        console.log(data);
        router.push("/");
    }

    function handleChange(e) {
        setErrors([]);
        setError("");
    }

    return (
        <main>
            <h2>Login</h2>
            { error && <p>{error}</p> }

            <form onSubmit={handleSubmit} onChange={handleChange} >
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholdeer="email@example.com" />
                    { errors[0] && <p>{errors[0]}</p> }
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <div>
                        <input type="password" id="password" placeholdeer="enter your password" />
                        <button type="button"><Image src="/icons/eyeopen.svg" alt="eye open" width={30} height={30} /></button>
                    </div>
                    { errors[1] && <p>{errors[1]}</p> }
                </div>

                <button type="submit">{loggingIn ? "Logging in..." : "Login"}</button>
            </form>
        </main>
    );
}
