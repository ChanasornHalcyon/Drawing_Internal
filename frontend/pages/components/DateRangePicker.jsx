import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ value, onChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
        if (update[0] && update[1]) {
          const formatted = {
            start: update[0].toISOString().split("T")[0],
            end: update[1].toISOString().split("T")[0],
          };
          onChange(formatted);
        }
      }}
      isClearable
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
    />
  );
};

export default DateRangePicker;
