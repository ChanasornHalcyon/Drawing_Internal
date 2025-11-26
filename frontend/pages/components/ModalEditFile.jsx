import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ModalEditFile = ({ onClose, onSubmit, submitting, sendData = {} }) => {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    date: "",
    drawing_no: "",
    rev: "",
    customer_name: "",
    description: "",
    material_main: "",
    coolant_hole: "",
    flute: "",
    cloating: "",
    price: "",
    cost: "",
  });

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");

    if (sendData) {
      setForm({
        date: sendData.date || "",
        drawing_no: sendData.drawing_no || "",
        rev: sendData.rev || "",
        customer_name: sendData.customer_name || "",
        description: sendData.description || "",
        material_main: sendData.material_main || "",
        coolant_hole: sendData.coolant_hole || "",
        flute: sendData.flute || "",
        cloating: sendData.cloating || sendData.coating || "",
        price: sendData.price || "",
        cost: sendData.cost || "",
      });
    }
  }, [sendData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = () => {
    const payload = {
      ...form,
      updated_by: localStorage.getItem("username") || "System",
      date: form.date ? new Date(form.date).toISOString().split("T")[0] : null,
    };
    onSubmit(payload, sendData.id);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start mt-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-[360px] sm:w-[420px] md:w-[520px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0">
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

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:border-[#1C70D3]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drawing No.
              </label>
              <input
                type="text"
                name="drawing_no"
                value={form.drawing_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rev
              </label>
              <input
                type="text"
                name="rev"
                value={form.rev}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                name="material_main"
                value={form.material_main}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flute
              </label>
              <select
                name="flute"
                value={form.flute}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              >
                <option value="">--- Select Flute ---</option>
                <option value="STRAIGHT">STRAIGHT</option>
                <option value="HELIX">HELIX</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coolant
              </label>
              <select
                name="coolant_hole"
                value={form.coolant_hole}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              >
                <option value="">--- Select Coolant ---</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coating
              </label>
              <select
                name="cloating"
                value={form.cloating}
                onChange={handleChange}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              >
                <option value="">--- Select Coating ---</option>
                <option value="TiAlN">TiAlN (FUTURA)</option>
                <option value="AlTiN">AlTiN (LATUMA)</option>
                <option value="TiN">TiN (A)</option>
                <option value="TiCN">TiCN (B)</option>
                <option value="DLC">DLC (HARDCARBON)</option>
                <option value="AlCrN">AlCrN</option>
              </select>
            </div>

            {role !== "Engineers" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                />
              </div>
            )}

            {role !== "Sale" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost
                </label>
                <input
                  type="text"
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t bg-white sticky bottom-0">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmitClick}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#3698FC] text-white hover:bg-blue-600"
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
