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

            // TODO: Sanitize data - arrays, strings, numbers, dates, etc. and validate required fields
            event.tags = typeof event.tags === "string" ? JSON.parse(event.tags as unknown as string) : event.tags;

            if (event.agenda) {
                const agendaData = typeof event.agenda === "string" ? JSON.parse(event.agenda as unknown as string) : event.agenda;
                event.agenda = Array.isArray(agendaData) ? agendaData : [agendaData];
            } else {
                event.agenda = [];
            }




        } catch (error) {
            console.error('Error parsing form data:', error);
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
        const newEvent: IEvent = await Event.create({ ...event } as IEvent);

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
