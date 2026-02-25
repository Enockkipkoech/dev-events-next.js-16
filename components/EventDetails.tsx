import { IEvent } from "@/database";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//Event Details Component
const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
    <div className="flex flex-row gap-2 items-center">
        <img src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>

);

// Agenda Item Component
const EventAgendaItem = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <ul>
            {
                agendaItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
        </ul >

    </div >
)

// Tag Component
const EventTag = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div className="pill" key={tag}>   {tag} </div>
        ))}

    </div>
)


const EventDetails = async ({ params }: { params: Promise<string> }) => {
    "use cache";
    cacheTag("event-details");
    cacheLife("hours");
    const slug = await params;

    const { success, message, data } = await getEventBySlug(slug);



    if (!success || !data?.event) {
        return notFound();
    }
    console.log(`Event Data Prototype:`,
        Object.getPrototypeOf(data.event)
    );

    const {
        event: {
            _id,
            title,
            description,
            image,
            overview,
            venue,
            location,
            date,
            time,
            mode,
            audience,
            agenda,
            organizer,
            tags,
        },
    } = data;

    // const request = await fetch(`${BASE_URL}/api/events/${slug}`);
    // // Check if request was successful before parsing JSON
    // if (!request.ok) {
    //     return notFound();
    // }
    // const data = await request.json();
    // const { event: { _id, title, description, image, overview, venue, location, date, time, mode, audience, agenda, organizer, tags, } } = data;

    // Validate required fields
    // if (!description || !title) {
    //     return notFound();
    // }

    // Safely parse agenda - handle missing, non-array, or malformed agenda
    const agendaArray: string[] = Array.isArray(agenda) ? agenda : (typeof agenda === 'string' ? [agenda] : []);

    const formattedTags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? [tags] : []);

    const bookings = 20; // Placeholder for number of bookings - replace with actual data when available
    const availabeSpots = 50;

    const similarEventsResult = await getSimilarEventsBySlug(slug);
    const similarEvents: IEvent[] = (Array.isArray(similarEventsResult.data) ? [] : similarEventsResult.data?.similarEvents) || [];

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description</h1>
                <p>{description}</p>
            </div>

            <div className="details">
                {/* {Left side - Event Content} */}
                <div className="content">
                    <img src={image} alt="Event Banner" width={800} height={800} className="banner" />
                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailItem icon="/icons/calendar.svg" alt="Calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="Clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="Location" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="Audience" label={audience} />
                    </section>


                    <EventAgendaItem agendaItems={agendaArray} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTag tags={formattedTags} />


                </div>

                {/* {Right side - Booking form} */}
                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {
                            bookings > 0 ? (
                                <p className="text-sm">{availabeSpots} spots left. Join over {bookings}  people who have already booked their spot!</p>
                            ) : (
                                <p className="text-sm">Be the first to book! Discount available for first 10 bookings.</p>)
                        }
                        <Suspense fallback={<div>Loading...</div>}>
                            <BookEvent eventId={_id.toString()} slug={slug} />
                        </Suspense>


                    </div>

                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={similarEvent._id.toString()} {...similarEvent} />
                    ))}

                </div>

            </div>

        </section >
    )
}

export default EventDetails