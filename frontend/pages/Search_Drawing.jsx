import React, { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Search_Drawing = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    dateRange: { start: null, end: null },
    drawingNo: "",
    rev: "",
    customerPart: "",
    description: "",
    materialMain: "",
    pcdGrade: "",
    coolantHole: "",
    flute: "",
    cloating: "",
    shankMaterial: "",
    shankShape: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dateRange } = form;
    if (
      !form.customerName &&
      !dateRange.start &&
      !dateRange.end &&
      !form.drawingNo &&
      !form.rev &&
      !form.customerPart &&
      !form.description &&
      !form.materialMain &&
      !form.pcdGrade &&
      !form.coolantHole &&
      !form.flute &&
      !form.cloating &&
      !form.shankMaterial &&
      !form.shankShape
    ) {
      localStorage.removeItem("searchResults");
      router.push("/Data");
      return;
    }

    try {
      const payload = {
        ...form,
        startDate: dateRange.start,
        endDate: dateRange.end,
      };

      const res = await axios.post(
        "http://localhost:4000/searchDrawing",
        payload
      );
      if (res.data.success) {
        localStorage.setItem("searchResults", JSON.stringify(res.data.data));
        router.push("/Data");
      }
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-white">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <div className="flex justify-center py-10 px-6">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-14 mt-20"
          >
            <h1 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
              Search Drawing
            </h1>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col col-span-1">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Date
                </label>
                <DatePicker
                  selectsRange
                  startDate={form.dateRange.start}
                  endDate={form.dateRange.end}
                  onChange={([start, end]) =>
                    setForm((prev) => ({
                      ...prev,
                      dateRange: { start, end },
                    }))
                  }
                  isClearable
                  placeholderText="Select start and end date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                />
              </div>

              {[
                ["Customer Name", "customerName"],
                ["Drawing No.", "drawingNo"],
                ["Rev", "rev"],
                ["Customer Part No.", "customerPart"],
                ["Description", "description"],
                ["Material", "materialMain"],
                ["PCD Grade", "pcdGrade"],
                ["Coolant Hole", "coolantHole"],
                ["Flute", "flute"],
                ["Coating", "cloating"],
                ["Shank Material", "shankMaterial"],
                ["Shank Shape", "shankShape"],
              ].map(([label, name]) => (
                <div key={name} className="flex flex-col">
                  <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="px-10 py-3 bg-[#1C70D3] text-white rounded-full text-lg font-medium shadow-md hover:bg-[#0A4EA3] hover:shadow-xl transition cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Search_Drawing;
