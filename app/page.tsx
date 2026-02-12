import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { cacheLife, cacheTag } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const Home = async () => {
  "use cache";
  cacheTag("events");
  cacheLife("seconds");
  let events: IEvent[] = [];

  try {

    const response = await fetch(`${BASE_URL}/api/events`, { cache: 'no-store' });

    // Check if response is successful before parsing JSON
    if (!response.ok) {
      console.error(`Failed to fetch events: HTTP ${response.status}`);
      // Fallback to empty events array
    } else {
      const data = await response.json();
      events = data.events || [];
    }
  } catch (error) {
    // Handle network failures and JSON parse errors
    console.error('Error fetching events:', error instanceof Error ? error.message : String(error));
    // Fallback to empty events array
  }

  return (
    <section>
      <h1 className="text-center">
        Tech-Events <br /> Blockchain.Web3.0.Digital-Assets-Trading
      </h1>
      <p className="text-center mt-5">Hacks, Meetups, and Conferences. All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent, index: any) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}

export default Home