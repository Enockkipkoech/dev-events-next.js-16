export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "Kenya Tech Summit 2026",
    image: "/images/event1.png",
    slug: "kenya-tech-summit-2026",
    location: "Nairobi, Kenya",
    date: "March 15-17, 2026",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "East Africa DevFest",
    image: "/images/event2.png",
    slug: "east-africa-devfest",
    location: "Mombasa, Kenya",
    date: "April 8-10, 2026",
    time: "8:30 AM - 6:00 PM",
  },
  {
    title: "Nairobi JavaScript Meetup",
    image: "/images/event3.png",
    slug: "nairobi-javascript-meetup",
    location: "Nyeri, Kenya",
    date: "February 20, 2026",
    time: "6:00 PM - 9:00 PM",
  },
  {
    title: "StartUp Grind Nairobi Conference",
    image: "/images/event4.png",
    slug: "startup-grind-nairobi",
    location: "Nairobi, Kenya",
    date: "May 12-14, 2026",
    time: "9:00 AM - 6:00 PM",
  },
  {
    title: "Africa Hackathon 2026",
    image: "/images/event5.png",
    slug: "africa-hackathon-2026",
    location: "Nairobi, Kenya",
    date: "June 21-23, 2026",
    time: "24 Hours",
  },
  {
    title: "Web3 Kenya Conference",
    image: "/images/event6.png",
    slug: "web3-kenya-conference",
    location: "Kisumu, Kenya",
    date: "July 5-7, 2026",
    time: "10:00 AM - 5:00 PM",
  },
];
