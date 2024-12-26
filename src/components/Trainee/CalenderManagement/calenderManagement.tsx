import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex justify-center items-center mt-10">
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md">
            Open Calendar
          </button>
        </PopoverTrigger>

        <PopoverContent className="bg-white p-6 rounded-lg shadow-lg mt-10">
          <DayPicker selected={selectedDate} onDayClick={setSelectedDate} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Calendar;
