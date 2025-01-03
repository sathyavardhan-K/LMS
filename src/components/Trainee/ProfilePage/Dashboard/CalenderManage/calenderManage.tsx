import React from "react";
import { DayPicker } from "react-day-picker"; // Make sure you import DayPicker correctly

const CalenderManage: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  return (
    <div className="bg-white p-4 rounded shadow ml-40 -mt-[80px] border-2 border-gray-200">
      <h2 className="text-lg font-bold">Calendar Management</h2>
      <p>Plan your schedule effectively!</p>
      <div className="border rounded-lg p-4 h-80 w-80 mt-4 ml-[60px]">
        <DayPicker
          selected={selectedDate || undefined}
          onDayClick={handleDateChange}
          className="rounded-lg custom-calendar"
        />
      </div>
      {selectedDate && (
        <p className="mt-4 text-sm text-gray-700">
          Selected Date: {selectedDate.toDateString()}
        </p>
      )}
    </div>
  );
};

export default CalenderManage;
