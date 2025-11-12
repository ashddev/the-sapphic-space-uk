import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface ChangeMonthButtonProps {
  direction: "future" | "past";
  currentDate: Date;
  selectedYear: number;
  selectedMonth: number;
  monthSetter: Dispatch<SetStateAction<number>>;
  yearSetter: Dispatch<SetStateAction<number>>;
}

const ChangeMonthButton = ({
  direction,
  currentDate,
  selectedYear,
  selectedMonth,
  monthSetter,
  yearSetter,
}: ChangeMonthButtonProps) => {
  const clickHander = () => {
    if (direction === "past") {
      if (selectedMonth === 0) yearSetter((prevYear) => prevYear - 1);
      monthSetter((prevMonth) => (prevMonth === 0 ? 11 : (prevMonth - 1) % 12));
    } else {
      if (selectedMonth === 11) yearSetter((prevYear) => prevYear + 1);
      monthSetter((prevMonth) => (prevMonth + 1) % 12);
    }
  };

  return (
    <Button
      className="cursor-pointer"
      variant={"outline"}
      onClick={clickHander}
      disabled={
        direction === "past" &&
        currentDate &&
        selectedMonth === currentDate.getMonth() &&
        selectedYear === currentDate.getFullYear()
      }
    >
      {direction === "past" ? <ChevronLeft /> : <ChevronRight />}
    </Button>
  );
};

export default ChangeMonthButton;
