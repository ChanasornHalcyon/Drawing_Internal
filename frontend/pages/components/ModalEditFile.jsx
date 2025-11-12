import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ModalEditFile = ({ onClose, onSubmit, submitting, initialData = {} }) => {
  const [form, setForm] = useState({
    date: "",
    drawing_no: "",
    description: "",
    customer_name: "",
    customer_part_no: "",
    material_main: "",
    pcd_grade: "",
    rev: "",
    coolant_hole: "",
    flute: "",
    coating: "",
    shank_material: "",
    shank_shape: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || "",
        drawing_no: initialData.drawing_no || "",
        description: initialData.description || "",
        customer_name: initialData.customer_name || "",
        customer_part_no: initialData.customer_part_no || "",
        material_main: initialData.material_main || "",
        pcd_grade: initialData.pcd_grade || "",
        rev: initialData.rev || "",
        coolant_hole: initialData.coolant_hole || "",
        flute: initialData.flute || "",
        coating: initialData.coating || "",
        shank_material: initialData.shank_material || "",
        shank_shape: initialData.shank_shape || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        <div className="bg-white rounded-2xl shadow-xl w-[350px] sm:w-[400px] md:w-[500px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
            <h5 className="text-2xl font-semibold text-black">Edit File</h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4 ">
            {[
              { name: "date", label: "Date", type: "date" },
              { name: "drawing_no", label: "Drawing No." },
              { name: "description", label: "Description" },
              { name: "customer_name", label: "Customer Name" },
              { name: "customer_part_no", label: "Customer Part No." },
              { name: "material_main", label: "Material" },
              { name: "pcd_grade", label: "PCD Grade" },
              { name: "rev", label: "Rev" },
              { name: "coolant_hole", label: "Coolant Hole" },
              { name: "flute", label: "Flute" },
              { name: "coating", label: "Coating" },
              { name: "shank_material", label: "Shank Material" },
              { name: "shank_shape", label: "Shank Shape" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(form, initialData.id)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#3698FC] text-white hover:bg-blue-600 cursor-pointer"
            >
              {submitting ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
    </>
  );
};

export default ModalEditFile;
