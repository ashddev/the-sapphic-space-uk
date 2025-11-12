import Calendar from "@/components/calendar/Calendar";
import Navigation from "@/components/Navigation";
import VideoBanner from "@/components/VideoBanner";

export interface OutSavvyEvent {
  id: number;
  name: string;
  description: string;
  url: string;
  dates: EventDate[];
  status: string;
  image_url: string;
  location_name: string;
  address_town: string;
  address_postcode: string;
  price: string;
}

interface EventDate {
  startlocal: string;
  endlocal: string;
  timezone: string;
  event_date_description: string;
}

const Home = async () => {
  const OUTSAVVY_ACCESS_TOKEN = process.env.OUTSAVVY_ACCESS_TOKEN ?? "";

  const events = await fetch(`https://api.outsavvy.com/v1/events/search`, {
    headers: { Authorization: `Partner ${OUTSAVVY_ACCESS_TOKEN}` },
  }).then((data) => data.json());

  return (
    <div className="w-full">
      <Navigation />
      <VideoBanner />

      <section className="flex h-[15dvh] items-center border-b bg-white shadow-sm">
        <div className="p-20 text-4xl font-semibold">As seen on...</div>
      </section>

      <section className="min-h-[100dvh] bg-pink-50 py-16">
        <h2 className="mb-10 text-center text-4xl font-semibold">
          Upcoming Events
        </h2>

        <div className="container mx-auto flex flex-col items-start justify-center gap-8 px-4">
          {events.events && (
            <Calendar events={events.events as OutSavvyEvent[]} />
          )}
        </div>
      </section>

      <footer className="bg-gray-900 py-10 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-semibold">The Sapphic Space UK</h3>
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-300 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
