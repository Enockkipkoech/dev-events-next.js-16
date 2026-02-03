import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/lib/constants"


const Home = () => {
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
          {events.map((event, index) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>

      </div>
    </section>
  )
}

export default Home