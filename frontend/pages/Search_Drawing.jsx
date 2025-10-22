import React, { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";

const Search_Drawing = () => {
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    drawingNo: "",
    rev: "",
    customerPart: "",
    description: "",
    materialMain: "",
    materialSub: "",
    pcdGrade: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Searching...");
  };

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-white">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center mt-8"
      >
        <div className="w-full max-w-[700px] bg-white px-8 md:px-32 xl:px-28   rounded-xl">
          <div className="space-y-5 w-full">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="block w-full border border-gray-400 rounded-md px-3 py-2 focus:border-[#0B4EA2] text-black"
              />
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                onClick={(e) => e.target.showPicker()}
                required
                className="block w-full border border-gray-400 rounded-md px-3 py-2 focus:border-[#0B4EA2] text-gray-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                Drawing No.
              </label>
              <input
                type="text"
                name="drawingNo"
                value={form.drawingNo}
                onChange={handleChange}
                className="block w-full border border-gray-400 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                Customer Part No.
              </label>
              <input
                type="text"
                name="customerPart"
                value={form.customerPart}
                onChange={handleChange}
                className="block w-full border border-gray-400 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="block w-full border border-gray-400 rounded-md px-3 py-2 text-black"
              />
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                name="materialMain"
                value={form.materialMain}
                onChange={handleChange}
                className="block w-full border border-gray-400 rounded-md px-2 py-2 text-black"
              >
                <option value="">Drop down</option>
                <option value="VCMT110302">VCMT110302</option>
                <option value="DCMT070204">DCMT070204</option>
              </select>
            </div>

            <div>
              <label className="block texr-lgfont-medium text-gray-700 mb-1">
                PCD Grade
              </label>
              <select
                name="pcdGrade"
                value={form.pcdGrade}
                onChange={handleChange}
                className="block w-full border border-gray-400 rounded-md px-2 py-2 text-black"
              >
                <option value="">Drop down</option>
                <option value="Standard">Standard</option>
                <option value="High Precision">High Precision</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-2 bg-[#1C70D3] text-white rounded-full hover:bg-[#0A4EA3] transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Search_Drawing;
