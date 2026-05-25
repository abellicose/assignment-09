'use client';

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sports = ["Football", "Cricket", "Basketball", "Badminton", "Tennis", "Swimming"];
const timeSlots = ["7am-8am", "8am-9am", "9am-10am", "4pm-5pm", "5pm-6pm", "6pm-7pm"];

const schema = z.object({
    name: z.string().min(1, "Enter facility name"),
    description: z.string().min(1, "Enter facility description"),
    image: z.string().min(1, "Not a valid url").url(),
    location: z.string().min(1, "Enter facility location"),
    facility_type: z.string().min(1, "Select a facility type"),
    capacity: z.number().positive("Capacity cannot be less than 1"),
    price_per_hour: z.number().positive("Price cannot be less than 1"),
    available_slots: z.array(z.string()).min(1, "Select at least one available slot"),
});

export default function AddFacility() {
    const [errors, setErrors] = useState({});
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            image: formData.get("image"),
            location: formData.get("location"),
            facility_type: formData.get("sport"),
            capacity: Number(formData.get("capacity")),
            price_per_hour: Number(formData.get("price_per_hour")),
            available_slots: formData.getAll("available_slots"),
        };
        const result = schema.safeParse(rawData);
        if (!result.success) {
            const parsedErrors = result.error.flatten().fieldErrors;
            setErrors({
                name: parsedErrors.name?.[0],
                description: parsedErrors.description?.[0],
                location: parsedErrors.location?.[0],
                sport: parsedErrors.sport?.[0],
                capacity: parsedErrors.capacity?.[0],
                price_per_hour: parsedErrors.price_per_hour?.[0],
                available_slots: parsedErrors.available_slots?.[0],
            });
            return;
        }
        const resp = await fetch(process.env.NEXT_PUBLIC_API_URL + "/facilities", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result.data),
        });
        const data = await resp.json();
        if (!resp.ok) {
            setErrors(prev => ({ ...prev, main: data.message }));
            return;
        }
        router.push("/profile/myfacilities");
        router.refresh();
    }

    function handleChange() { setErrors({}); }

    function FieldError({ name }) {
        return errors[name] ? <p className="text-xs text-red-400 mt-1">{errors[name]}</p> : null;
    }

    const inputClass = "w-full rounded-lg border border-surface-subtle bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none transition-colors";
    const labelClass = "text-sm font-medium text-ink-muted";

    return (
        <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-ink">Add Facility</h2>

            {errors.main && (
                <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3">
                    <p className="text-sm text-red-400">{errors.main}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} onChange={handleChange} className="flex flex-col gap-5">

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className={labelClass}>Facility Name</label>
                    <input name="name" id="name" type="text" placeholder="Enter facility name..." className={inputClass} />
                    <FieldError name="name" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className={labelClass}>Description</label>
                    <input name="description" id="description" type="text" placeholder="Describe the facility..." className={inputClass} />
                    <FieldError name="description" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="image" className={labelClass}>Image URL</label>
                    <input name="image" id="image" type="url" placeholder="https://..." className={inputClass} />
                    <FieldError name="image" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="location" className={labelClass}>Location</label>
                        <input name="location" id="location" type="text" placeholder="Enter facility location..." className={inputClass} />
                        <FieldError name="location" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="sport" className={labelClass}>Sport</label>
                        <select name="sport" id="sport" className={inputClass}>
                            <option value="">Select a Facility Type</option>
                            {sports.map(sport => (
                                <option key={sport} value={sport.toLowerCase()}>{sport}</option>
                            ))}
                        </select>
                        <FieldError name="sport" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="capacity" className={labelClass}>Capacity</label>
                        <input name="capacity" id="capacity" type="number" placeholder="Enter capacity..." defaultValue="0" className={inputClass} />
                        <FieldError name="capacity" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="price_per_hour" className={labelClass}>Price Per Hour (৳)</label>
                        <input name="price_per_hour" id="price_per_hour" type="number" placeholder="Enter price per hour..." defaultValue="0" className={inputClass} />
                        <FieldError name="price_per_hour" />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className={labelClass}>Available Slots</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map(slot => (
                            <label key={slot} className="flex items-center gap-2.5 rounded-lg border border-surface-subtle bg-surface px-3 py-2.5 cursor-pointer hover:border-brand transition-colors has-[:checked]:border-brand has-[:checked]:bg-surface-muted">
                                <input type="checkbox" name="available_slots" value={slot.toLowerCase()} className="accent-brand" />
                                <span className="text-sm text-ink">{slot}</span>
                            </label>
                        ))}
                    </div>
                    <FieldError name="available_slots" />
                </div>

                <button type="submit" className="mt-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-surface hover:bg-brand-light transition-colors">
                    Add Facility
                </button>

            </form>
        </section>
    );
}
