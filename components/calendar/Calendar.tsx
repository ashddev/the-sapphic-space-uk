"use client";
import { useEffect, useState } from "react";
import ChangeMonthButton from "./ChangeMonthButton";
import CalendarDay from "./CalendarDay";
import { OutSavvyEvent } from "@/app/home/page";
import {
  calendarInit,
  daysOfWeek,
  getMonthFromNumber,
  isEventOnThisDate,
} from "./utils";

interface CalendarProps {
  events: OutSavvyEvent[];
}

const Calendar = ({ events }: CalendarProps) => {
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  );

  const [calendarView, setCalendarView] = useState<number[][]>(
    calendarInit(selectedMonth, selectedYear)
  );

  useEffect(() => {
    setCalendarView(calendarInit(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-10">
      <div className="flex items-center justify-between w-3xl">
        <ChangeMonthButton
          direction="past"
          currentDate={currentDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthSetter={setSelectedMonth}
          yearSetter={setSelectedYear}
        />
        <div className="flex gap-2 font-semibold text-2xl">
          <div>{getMonthFromNumber(selectedMonth)}</div>
          <div>{selectedYear}</div>
        </div>
        <ChangeMonthButton
          direction="future"
          currentDate={currentDate}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          monthSetter={setSelectedMonth}
          yearSetter={setSelectedYear}
        />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div className="flex items-center justify-center" key={day}>
            {day.slice(0, 3)}
          </div>
        ))}
        {calendarView.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <CalendarDay
              key={`${dayIndex}-${weekIndex}-${selectedMonth}-${selectedYear}`}
              day={day}
              currentDate={currentDate}
              event={
                events.filter((event) =>
                  isEventOnThisDate(
                    event.dates[0].startlocal,
                    day,
                    selectedMonth,
                    selectedYear
                  )
                )[0]
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
