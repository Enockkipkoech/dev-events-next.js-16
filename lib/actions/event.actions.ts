"use server";

import { Event } from "@/database";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug });
        const similarEvents = await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean();

        return { success: true, message: 'Similar events fetched successfully', events: similarEvents }

    } catch (error) {
        return {
            success: false,
            message: 'Failed to fetch similar events', error: error instanceof Error ? error.message : String(error),
            events: []
        }

    }
};