import React from "react";
import { DayPicker } from "react-day-picker"; // Make sure you import DayPicker correctly

const CalenderManage: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  return (
    <div className="bg-white p-2 ml-40">
      <div className="ml-8">
        <div className="border rounded-lg p-3 h-96 w-80 ml-[30px] items-center justify-center flex flex-col mt-5">
          <h2 className="text-lg font-bold mt-3 text-slate-800">Calendar Management</h2>
          <p>Plan your schedule effectively!</p>
       

        <DayPicker
          selected={selectedDate || undefined}
          onDayClick={handleDateChange}
          className="rounded-lg custom-calendar"
        />
      </div>
      {selectedDate && (
        <p className="mt-4 text-sm text-gray-700 ml-9">
          Selected Date: {selectedDate.toDateString()}
        </p>
      )}
      </div>

    </div>
  );
};

export default CalenderManage;
