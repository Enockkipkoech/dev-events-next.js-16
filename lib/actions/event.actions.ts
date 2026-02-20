"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";
import { cacheLife, cacheTag } from "next/cache";

export const getSimilarEventsBySlug = async (slug: string) => {
    "use cache";
    cacheTag("similar-events");
    cacheLife("minutes");

    try {
        await connectDB();
        const event = await Event.findOne({ slug });
        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();


        const serializedEvent = similarEvents.map((similarEvent) => ({
            ...similarEvent,
            _id: similarEvent._id.toString(),
            createdAt: similarEvent.createdAt?.toISOString(),
            updatedAt: similarEvent.updatedAt?.toISOString(),
        }));

        return { success: true, message: 'Similar events fetched successfully', data: { similarEvents: serializedEvent } }

    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch similar events', error: error instanceof Error ? error.message : String(error),
            data: []
        }

    }
};

export const getEventBySlug = async (slug: string) => {
    "use cache";
    cacheTag("events");
    cacheLife("minutes");

    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        const serializedEvent = event ? {
            ...event,
            _id: event._id.toString(),
            createdAt: event.createdAt?.toISOString(),
            updatedAt: event.updatedAt?.toISOString(),
        } : null;

        return { success: true, message: 'Event fetched successfully', data: { event: serializedEvent } };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch event', error: error instanceof Error ? error.message : String(error),
            data: null
        }
    }
}