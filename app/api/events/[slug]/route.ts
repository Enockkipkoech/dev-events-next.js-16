import { Event, IEvent } from '@/database';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Define route params type for type safety
type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

// A Route that accepts a slug as input -> returns the event details for that slug
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '') return NextResponse.json({ message: 'Invalid or missing Slug. Parameter is required' }, { status: 400 });

        // Sanitize slug (remove any potential malicious input)
        const sanitizedSlug = slug.trim().toLowerCase();

        const event: IEvent | null = await Event.findOne({ slug: sanitizedSlug }).lean();

        if (!event) return NextResponse.json({ message: `Event with slug "${sanitizedSlug}" not found` }, { status: 404 });

        return NextResponse.json({ message: 'API event fetched successfully', event }, { status: 200 });

    } catch (error) {
        // Log error for debugging (only in development)
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching events by slug:', error);
        }
        // Handle specific error types
        if (error instanceof Error) {
            // Handle database connection errors
            if (error.message.includes('MONGODB_URI')) {
                return NextResponse.json(
                    { message: 'Database configuration error' },
                    { status: 500 }
                );
            }
            return NextResponse.json({ message: 'Failed to fetch SLUG-API event', error: error instanceof Error ? error.message : String(error) }, { status: 500 });

        }
        // Handle unexpected errors
        return NextResponse.json({ message: 'An unexpected error occurred', error: String(error) }, { status: 500 });
    }
}  