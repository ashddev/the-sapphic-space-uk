import { OutSavvyEvent } from "@/app/home/page";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CalendarDayProps {
  key: string;
  day: number;
  // TODO: show current date
  currentDate: Date;
  event?: OutSavvyEvent;
}

const CalendarDay = ({ key, day, event }: CalendarDayProps) => {
  if (day === -1) {
    return <div className="bg-gray-100" key={key}></div>;
  }

  const backgroundStyle = event
    ? {
        backgroundImage: `url(${event.image_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <Link
      href={event?.url ? event.url : ""}
      target="_blank"
      className={cn(
        `w-26 h-26 p-2 rounded-lg border flex justify-end items-start`,
        event ? "cursor-pointer" : "cursor-default"
      )}
      style={backgroundStyle}
      key={key}
    >
      <div
        className={`p-1 px-2 ${
          event ? "opacity-80 bg-gray-200 rounded-sm border" : ""
        }`}
      >
        <span>{day}</span>
      </div>
    </Link>
  );
};

export default CalendarDay;
