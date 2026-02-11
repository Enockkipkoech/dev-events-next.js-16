import { notFound } from 'next/navigation';


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
            <div key={tag} className="pill">   {tag} </div>
        ))}

    </div>
)

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = await params;
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, { cache: 'no-store', next: { revalidate: 60 } });

    // Check if request was successful before parsing JSON
    if (!request.ok) {
        return notFound();
    }

    const data = await request.json();

    // Validate response structure
    if (!data || !data.event) {
        return notFound();
    }

    const { event: { title, description, image, overview, venue, location, date, time, mode, audience, agenda, organizer, tags, } } = data;

    // Validate required fields
    if (!description || !title) {
        return notFound();
    }

    // Safely parse agenda - handle missing, non-array, or malformed agenda
    let agendaArray: string[] = [];
    if (agenda) {
        if (Array.isArray(agenda)) {
            agendaArray = agenda as string[];
        } else if (typeof agenda === 'string') {
            try {
                const parsed = JSON.parse(agenda);
                if (Array.isArray(parsed)) {
                    agendaArray = parsed as string[];
                } else {
                    // Fallback to splitting string on commas or semicolons
                    agendaArray = agenda
                        .split(/[,;]/)
                        .map(item => item.trim())
                        .filter(item => item.length > 0);
                }
            } catch {
                // JSON parse failed, split on commas or semicolons
                agendaArray = agenda
                    .split(/[,;]/)
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            }
        }
    }

    // Safely parse tags - handle missing, non-array, or malformed tags
    let tagsArray: string[] = [];
    if (tags) {
        if (Array.isArray(tags)) {
            tagsArray = tags as string[];
        } else if (typeof tags === 'string') {
            try {
                const parsed = JSON.parse(tags);
                if (Array.isArray(parsed)) {
                    tagsArray = parsed as string[];
                } else {
                    // Fallback to splitting string on commas or semicolons
                    tagsArray = tags
                        .split(/[,;]/)
                        .map(item => item.trim())
                        .filter(item => item.length > 0);
                }
            } catch {
                // JSON parse failed, split on commas or semicolons
                tagsArray = tags
                    .split(/[,;]/)
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            }
        }
    }

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

                    <EventTag tags={tagsArray} />


                </div>

                {/* {Right side - Booking form} */}
                <aside className="booking">
                    <p className="text-lg font-semibold">Book Your Spot</p>

                </aside>
            </div>

        </section >
    )
}

export default EventDetailsPage;