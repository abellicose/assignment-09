"use client";

import { useState } from "react";
import { z } from "zod";

export default function Register() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [errors, setErrors] = useState([]);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const errors = [];
        const payload = {};
        const form = e.target;
        console.log("HI");
        for (const data of form) {
            console.log(data);
            payload[data.name] = data.value;
        }
        console.log(payload);

        const schema = z.object({
            name: z.string().min(1, "Please enter your name"),
            email: z.string().email("Invalid Email"),
            password: z.string().min(6, "Password Must be at least 6 Characters").regex(/[A-Z]/, "Need one uppercase").regex(/[a-z]/, "Need one lowercase"),
            profileUrl: z.string().url().optional()
        });

        const result = schema.safeParse(payload);
        if (!result.success) {
            console.log(result.error.flatten().fieldErrors);
        }
    }

    function handleChange(e) {
        setErrors([]);
        setError("");
    }

    return (
        <main>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} onChange={handleChange} >
                <div>
                    <label htmlFor="name">Your name:</label>
                    <input name="name" id="name" type="text" placeholder="Enter your full name" />
                    { errors[0] && <p>{errors[0]}</p> }
                </div>

                <div>
                    <label htmlFor="email">Your email:</label>
                    <input name="email" id="email" type="email" placeholder="Enter your email" />
                    { errors[1] && <p>{errors[1]}</p> }
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input name="password" id="password" type="password" placeholder="Enter your password" />
                    { errors[2] && <p>{errors[2]}</p> }
                </div>

                <div>
                    <label htmlFor="profileUrl">Profile Picture URL (Optional): </label>
                    <input name="profileUrl" id="profileUrl" type="url" placeholder="https://example.com/image/..." />
                    { errors[3] && <p>{errors[3]}</p> }
                </div>

                <button type="submit">{ isRegistering ? "Registering..." : "Register" }</button>
            </form>
        </main>
    );
}
