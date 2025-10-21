import React, { useState } from "react";
import { motion } from "framer-motion";

const ModalAddFile = ({ onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState({
    reason: "",
    description: "",
    customerPart: "",
    dwgNo: "",
    customerName: "",
    file: null,
  });
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, file }));

      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";
      setFileType(isImage ? "image" : isPDF ? "pdf" : "other");

      if (isImage) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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
        <div className="bg-white rounded-2xl shadow-xl w-[350px] sm:w-[400px] md:w-[500px]">
          <div className="flex justify-between items-center p-4 border-b">
            <h5 className="text-2xl font-semibold text-black">Add File</h5>
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
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={form.material || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Part
                </label>
                <input
                  type="text"
                  name="customerPart"
                  value={form.customerPart}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DWG No.
                </label>
                <input
                  type="text"
                  name="dwgNo"
                  value={form.dwgNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#3698FC] text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image / PDF
              </label>
              <input
                type="file"
                name="file"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="w-full text-sm text-gray-600 border border-gray-300 rounded-md 
                           file:mr-4 file:py-2 file:px-4 file:border-0 
                           file:bg-[#3698FC] file:text-white file:rounded-md 
                           hover:file:bg-blue-500 cursor-pointer"
              />

              {fileType === "image" && preview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded border"
                  />
                </div>
              )}

              {fileType === "pdf" && form.file && (
                <div className="mt-3 text-center">
                  <a
                    href={URL.createObjectURL(form.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 "
                  >
                    View PDF
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(form)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#3698FC] text-white hover:bg-blue-600 cursor-pointer"
            >
              Submit
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

export default ModalAddFile;
