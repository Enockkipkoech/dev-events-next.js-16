"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";
import { cacheLife, cacheTag } from "next/cache";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        "use cache";
        cacheTag("similar-events");
        cacheLife("minutes");
        await connectDB();

        const event = await Event.findOne({ slug });
        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();

        return { success: true, message: 'Similar events fetched successfully', data: similarEvents }

    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch similar events', error: error instanceof Error ? error.message : String(error),
            data: []
        }

    }
};

export const getEventBySlug = async (slug: string) => {
    try {
        "use cache";
        cacheTag("events");
        cacheLife("minutes");

        await connectDB();
        const event = await Event.findOne({ slug }).lean();
        return { success: true, message: 'Event fetched successfully', data: event };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch event', error: error instanceof Error ? error.message : String(error),
            data: null
        }
    }
}