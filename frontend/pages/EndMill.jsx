import React, { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { FaFilePdf } from "react-icons/fa6";

const EndMill = () => {
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
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setForm({ ...form, file });

      const isImage = file?.type?.startsWith("image/");
      const isPDF = file?.type === "application/pdf";

      setFileType(isImage ? "image" : isPDF ? "pdf" : "other");
      setPreview(
        isImage ? URL.createObjectURL(file) : isPDF ? file.name : null
      );
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const userId = localStorage.getItem("userId");
      if (userId) {
        formData.append("employee_drawing", userId);
      } else {
        alert(" ไม่พบข้อมูลผู้ใช้ในระบบ กรุณา login ใหม่");
        return;
      }

      const res = await axios.post("http://localhost:4000/pushData", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(" Submit Successfully!");
        setForm({
          customerName: "",
          date: "",
          drawingNo: "",
          rev: "",
          customerPart: "",
          description: "",
          materialMain: "",
          pcdGrade: "",
          file: null,
        });
        setPreview(null);
      } else {
        alert(" Submit Failed!");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert(" Server Error!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
        <div className="flex justify-center py-10 px-6 ">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-14 mt-20"
          >
            <h1 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
              End Mill Drawing
            </h1>

            <div className="grid grid-cols-2 gap-5">
              {[
                ["Customer Name", "customerName"],
                ["Date", "date", "date"],
                ["Drawing No.", "drawingNo"],
                ["Rev", "rev"],
                ["Customer  No.", "customerPart"],
                ["Description", "description"],
                ["Material", "materialMain"],
                ["PCD Grade", "pcdGrade"],
                ["Coolant Hole", "CoolantHole"],
                ["Flute", "Flute"],
                ["Coating", "Cloating"],
                ["Shank Material", "ShankMaterial"],
                ["Shank Shape", "ShankShape"],
              ].map(([label, name, type = "text"]) => (
                <div key={name} className="flex flex-col">
                  <label className="block text-gray-700 text-[12px] font-semibold mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={["customerName", "date"].includes(name)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm  focus:border-[#1C70D3] transition"
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center">
              <div className="w-full max-w-md h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                {preview ? (
                  <div className="mb-4 text-center">
                    {fileType === "image" ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-60 h-40 object-contain mx-auto rounded-md shadow-md"
                      />
                    ) : fileType === "pdf" ? (
                      <div className="flex flex-col items-center text-red-600">
                        <FaFilePdf size={50} />
                        <p className="text-blue-600 mt-3 font-medium">
                          {preview}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Unsupported file type
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-3">No file selected</p>
                )}

                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="px-6 py-2 bg-[#1C70D3] text-white rounded-full shadow hover:shadow-lg hover:bg-[#0A4EA3] transition cursor-pointer"
                >
                  Upload File
                </label>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="px-10 py-3 bg-[#1C70D3] text-white rounded-full text-lg font-medium shadow-md hover:bg-[#0A4EA3] hover:shadow-xl transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EndMill;

