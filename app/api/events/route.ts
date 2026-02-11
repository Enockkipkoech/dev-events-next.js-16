import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Event, IEvent } from "@/database"

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const formData = await request.formData();

        let event: Partial<IEvent> = {};

        try {
            event = Object.fromEntries(formData.entries());
            console.log('Received form data:', event);

            //TODO: Sanitize data - arrays, strings, numbers, dates, etc. and validate required fields

        } catch (error) {
            return NextResponse.json({ message: 'Invalid JSON form data', error: error instanceof Error ? error.message : String(error) }, { status: 400 });

        }
        // FORMAT AND VALIDATE FIELDS
        const file = formData.get('image') as File;
        if (!file) return NextResponse.json({ message: 'Image file is required' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'events' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });
        event.image = (uploadResult as { secure_url: string }).secure_url;

        // Create and save the new event to the database
        const newEvent: IEvent = await Event.create(event);

        return NextResponse.json({ message: 'API event created successfully', event: newEvent }, { status: 201 });

    } catch (error) {
        console.log('Error creating API event:', error);
        return NextResponse.json({ message: 'Failed to create API event', error: error instanceof Error ? error.message : String(error) }, { status: 500 });

    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: 'API events fetched successfully', events }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch API events', error: error instanceof Error ? error.message : String(error) }, { status: 500 });

    }
}
