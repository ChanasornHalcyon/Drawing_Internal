import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa6";

const ModalEditFile = ({ onClose, onSubmit, submitting, sendData = {} }) => {
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    date: "",
    drawing_no: "",
    rev: "",
    customer_name: "",
    description: "",
    material_main: "",
    coolant_hole: "",
    flute: "",
    coating: "",
    price: "",
    cost: "",
    A1: "",
    A2: "",
    A3: "",
    D1: "",
    D2: "",
    D3: "",
    CL1: "",
    CL2: "",
    TL: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFile(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitClick = () => {
    const payload = new FormData();

    payload.append("updated_by", localStorage.getItem("username") || "System");
    payload.append("date", form.date);

    Object.keys(form).forEach((key) => {
      if (key !== "date") payload.append(key, form[key]);
    });

    if (file) payload.append("file", file);

    onSubmit(payload, sendData.id);
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");

    if (sendData) {
      setForm({
        date: sendData.date
          ? new Date(sendData.date).toLocaleDateString("en-CA")
          : "",
        drawing_no: sendData.drawing_no || "",
        rev: sendData.rev || "",
        customer_name: sendData.customer_name || "",
        description: sendData.description || "",
        material_main: sendData.material_main || "",
        coolant_hole: sendData.coolant_hole || "",
        flute: sendData.flute || "",
        coating: sendData.coating || "",
        price: sendData.price || "",
        cost: sendData.cost || "",
        A1: sendData.A1 || "",
        A2: sendData.A2 || "",
        A3: sendData.A3 || "",
        D1: sendData.D1 || "",
        D2: sendData.D2 || "",
        D3: sendData.D3 || "",
        CL1: sendData.CL1 || "",
        CL2: sendData.CL2 || "",
        TL: sendData.TL || "",
      });
    }
  }, [sendData]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start mt-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-[380px] sm:w-[480px] md:w-[560px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-5 border-b bg-white sticky top-0 shadow-sm">
            <h5 className="text-2xl font-semibold text-black">
              Update Drawing
            </h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Drawing No.
                </label>
                <input
                  type="text"
                  name="drawing_no"
                  value={form.drawing_no}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Rev</label>
                <input
                  type="text"
                  name="rev"
                  value={form.rev}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>

              {role !== "Sale" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="text"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Material
                </label>
                <select
                  name="material_main"
                  value={form.material_main}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--- Select Material ---</option>
                  <option value="CB">CB</option>
                  <option value="STL+CB">STL+CB</option>
                  <option value="CB+PCD">CB+PCD</option>
                  <option value="STL+PCD">STL+PCD</option>
                  <option value="STL+CB+PCD">STL+CB+PCD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Coolant
                </label>
                <select
                  name="coolant_hole"
                  value={form.coolant_hole}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--- Select Coolant ---</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Flute
                </label>
                <select
                  name="flute"
                  value={form.flute}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--- Select Flute ---</option>
                  <option value="STRAIGHT">STRAIGHT</option>
                  <option value="HELIX">HELIX</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Coating
                </label>
                <select
                  name="coating"
                  value={form.coating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                >
                  <option value="">--- Select Coating ---</option>
                  <option value="TiAlN">TiAlN</option>
                  <option value="AlTiN">AlTiN</option>
                  <option value="TiN(A)">TiN(A)</option>
                  <option value="TiCN(B)">TiCN(B)</option>
                  <option value="DLC">DLC</option>
                  <option value="AlCrN">AlCrN</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {role !== "Engineers" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Sales Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["A1", "A1"],
                ["A2", "A2"],
                ["A3", "A3"],
                ["D1", "D1"],
                ["D2", "D2"],
                ["D3", "D3"],
                ["CL1", "CL1"],
                ["CL2", "CL2"],
                ["TL", "TL"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-black text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="block text-sm text-gray-700 mb-1">
                Upload File
              </label>

              <input
                id="fileInput"
                type="file"
                name="file"
                accept=".pdf,.jpg,.png"
                onChange={handleChange}
                className="hidden"
              />

              <div
                onClick={() => document.getElementById("fileInput").click()}
                className="w-full text-black flex px-3 gap-2 py-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              >
                <FaFilePdf className="text-red-600 text-xl" />
                {file
                  ? file.name
                  : sendData.file_url?.split("/").pop() || "Choose File"}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-5 border-t bg-white sticky bottom-0">
            <button
              onClick={onClose}
              className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={submitting}
              className="px-4 py-2 cursor-pointer rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
            >
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        animate={{ opacity: 0.5 }}
        onClick={onClose}
      />
    </>
  );
};

export default ModalEditFile;
