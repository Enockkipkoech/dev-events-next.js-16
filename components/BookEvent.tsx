"use client";

import { createBooking } from "@/lib/actions/bookings.actions";
import posthog from "posthog-js";
import { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("BookEvent props:", { eventId, slug, email });
        const { success, message } = await createBooking({ eventId, slug, email });

        if (success) {
            setSubmitted(true);
            //Track booking event with analytics
            posthog.capture("booking_created", {
                eventId,
                slug,
                email
            });
        } else {
            setError("Failed to create booking. Please try again.");
            console.error("Booking error:", message);
            posthog.captureException(new Error(message), {
                context: {
                    eventId, slug, email
                }
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setError("");

        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>

                    <button type="submit" className="button-submit">
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default BookEvent;
