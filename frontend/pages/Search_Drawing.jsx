import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilePdf } from "react-icons/fa6";
const Search_Drawing = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    dateRange: { start: null, end: null },
    drawingNo: "",
    rev: "",
    customerPart: "",
    description: "",
    materialMain: "",
    coolantHole: "",
    flute: "",
    cloating: "",
    price: "",
    cost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dateRange } = form;

    const isEmpty =
      !form.customerName &&
      !dateRange.start &&
      !dateRange.end &&
      !form.drawingNo &&
      !form.rev &&
      !form.customerPart &&
      !form.description &&
      !form.materialMain &&
      !form.coolantHole &&
      !form.flute &&
      !form.cloating &&
      !form.price &&
      !form.cost;
    if (isEmpty) {
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
      } else {
        alert("ไม่พบข้อมูลตามเงื่อนไข");
      }
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
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

              <div className="flex flex-col">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                />
              </div>
              {[
                ["Drawing No.", "drawingNo"],
                ["Rev", "rev"],
                ["Customer Part No.", "customerPart"],
                ["Description", "description"],
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

              {role !== "Engineers" && (
                <div className="flex flex-col">
                  <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                    Sales Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                  />
                </div>
              )}

              {role !== "Sale" && (
                <div className="flex flex-col">
                  <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                  />
                </div>
              )}

              <div className="flex flex-col">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Material
                </label>
                <select
                  name="materialMain"
                  value={form.materialMain}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                >
                  <option value="">--- Select Material ---</option>
                  <option value="CB">CB</option>
                  <option value="STL+CB">STL+CB</option>
                  <option value="CB+PCD">CB+PCD</option>
                  <option value="STL+PCD">STL+PCD</option>
                  <option value="STL+CB+PCD">STL+CB+PCD</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Flute
                </label>
                <select
                  name="flute"
                  value={form.flute}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                >
                  <option value="">--- Select Flute ---</option>
                  <option value="STRAIGHT">STRAIGHT</option>
                  <option value="HELIX">HELIX</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Coolant
                </label>
                <select
                  name="coolantHole"
                  value={form.coolantHole}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                >
                  <option value="">--- Select Coolant ---</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 text-[12px] md:text-lg font-semibold mb-1">
                  Coating
                </label>
                <select
                  name="cloating"
                  value={form.cloating}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                >
                  <option value="">--- Select Coating ---</option>
                  <option value="TiAlN">TiAlN (FUTURA)</option>
                  <option value="AlTiN">AlTiN (LATUMA)</option>
                  <option value="TiN(A)">TiN (A)</option>
                  <option value="TiCN(B)">TiCN (B)</option>
                  <option value="DLC">DLC (HARDCARBON)</option>
                  <option value="AlCrN">AlCrN (AlCrN)</option>
                </select>
              </div>
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
