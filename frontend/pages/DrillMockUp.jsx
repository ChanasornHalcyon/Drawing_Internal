import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarDrawing from "../components/NavbarDrawing";
import { FaFilePdf } from "react-icons/fa6";
const DrillMockUp = () => {
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    drawingNo: "",
    rev: "",
    customerPart: "",
    description: "",
    materialMain: "",
    pcdGrade: "",
    price: "",
    cost: "",
    CoolantHole: "",
    Flute: "",
    Coating: "",
    numberOfSteps: "",
    chamferCutting: "",
    materialType: "",
    numberOfFlutes: "",
    fluteLength: "",
    stepLength1: "",
    stepLength2: "",
    stepLength3: "",
    helixAngle: "",
    totalLength: "",
    shankDiameter: "",
    coolantThru: "",
    shankBodyType: "",
    pcdCenterCutting: "",
    sandwichOrCorner: "",
    type: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [role, setRole] = useState("");
  const [checkDrawigs, setCheckDrawings] = useState(false);
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

      formData.append(
        "username",
        localStorage.getItem("username") || "Unknown"
      );

      const res = await axios.post("http://localhost:9000/pushData", formData, {
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
          price: "",
          cost: "",
          CoolantHole: "",
          Flute: "",
          Coating: "",
          type: "",
          file: null,
        });
        setPreview(null);
      } else {
        alert(" Submit Failed!");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server Error!");
    }
  };

  const checkDrawingNo = async (value) => {
    try {
      if (!value.trim()) {
        setCheckDrawings(false);
        return;
      }
      const res = await axios.get("http://localhost:9000/checkDrawingNo", {
        params: { drawingNo: value },
      });
      setCheckDrawings(res.data.exists);
    } catch (err) {
      console.error("Check error:", err);
    }
  };
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

  return (
    <>
      <NavbarDrawing />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex flex-col">
        <div
          className={`flex py-10 px-4 
    ${form.img ? "justify-center lg:justify-start" : "justify-center"}
  `}
        >
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-14 mt-20 lg:ml-20"
          >
            <h1 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
              Drill Drawing
            </h1>
            <div className="flex flex-col">
              <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                Select Drawing Type
              </label>

              <select
                name="type"
                value={form.type}
                onChange={(e) => {
                  const option = e.target.selectedOptions[0];
                  setForm({
                    ...form,
                    type: option.value,
                    img: option.getAttribute("data-img"),
                  });
                }}
                className="w-full border border-l-4 border-l-red-500  border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
              >
                <option value="">--- Select Drawing ---</option>

                <option
                  value="CDR CARBIDE DRILL STRAIGTH"
                  data-img="Drawing1.png"
                >
                  CDR CARBIDE DRILL STRAIGTH
                </option>

                <option value="CDR CARBIDE DRILL HELIX" data-img="Drawing2.png">
                  CDR CARBIDE DRILL HELIX
                </option>

                <option value="DDR PCD DRILL STRAIGTH" data-img="Drawing3.png">
                  DDR PCD DRILL STRAIGTH
                </option>

                <option value="DDR PCD DRILL HELIX" data-img="Drawing4.png">
                  DDR PCD DRILL HELIX
                </option>

                <option
                  value="DDRS PCD SOLID DRILL STRAIGTH"
                  data-img="Drawing5.png"
                >
                  DDRS PCD SOLID DRILL STRAIGTH
                </option>

                <option
                  value="DDRS PCD SOLID DRILL HELIX"
                  data-img="Drawing6.png"
                >
                  DDRS PCD SOLID DRILL HELIX
                </option>

                <option value="DDRW PCD SANDWICH DRILL" data-img="Drawing7.png">
                  DDRW PCD SANDWICH DRILL
                </option>

                <option
                  value="DDRW PCD SANDWICH DRILL HELIX"
                  data-img="Drawing8.png"
                >
                  DDRW PCD SANDWICH DRILL HELIX
                </option>
              </select>
            </div>
            {form.img && (
              <div className="mt-6 flex justify-center lg:hidden">
                <img
                  src={`/${form.img}`}
                  className="w-[400px] h-auto object-contain rounded-xl shadow-lg border bg-white p-2"
                  alt="Drawing Preview"
                />
              </div>
            )}

            {form.img && (
              <div className="hidden lg:block fixed right-10 top-28 z-50">
                <img
                  src={`/${form.img}`}
                  className="w-[650px] h-auto object-contain rounded-xl shadow-lg border bg-white p-2"
                  alt="Drawing Preview"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col">
                <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                  Drawing No.
                </label>

                <input
                  type="text"
                  name="drawingNo"
                  value={form.drawingNo}
                  onChange={(e) => {
                    handleChange(e);
                    checkDrawingNo(e.target.value);
                  }}
                  required
                  className={`w-full border border-l-4 border-l-red-500  rounded-lg text-black px-3 py-2 shadow-sm transition text-black
                  ${checkDrawigs
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#1C70D3]"
                    }`}
                />

                {checkDrawigs && (
                  <p className="text-red-500 text-[13px] mt-1">
                    Drawing Number นี้มีในระบบแล้ว
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full border border-l-4 border-l-red-500  border-gray-300 rounded-lg text-black px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-l-4 border-l-red-500  border-gray-300 rounded-lg text-black px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                />
              </div>

              {[
                ["Rev", "rev"],
                ["Customer Part  No.", "customerPart"],
                ["Description", "description"],

              ].map(([label, name]) => (
                <div key={name} className="flex flex-col">
                  <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                  />
                </div>
              ))}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

              {/* Number of Steps */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Number of steps
                </label>
                <input
                  type="number"
                  name="numberOfSteps"
                  value={form.numberOfSteps}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Chamfer Cutting */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Chamfer cutting?
                </label>
                <select
                  name="chamferCutting"
                  value={form.chamferCutting}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select ---</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              {/* Carbide or PCD */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Carbide or PCD?
                </label>
                <select
                  name="materialType"
                  value={form.materialType}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select Material ---</option>
                  <option value="Carbide">Carbide</option>
                  <option value="PCD">PCD</option>
                </select>
              </div>

              {/* Number of flutes */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Number of flutes
                </label>
                <input
                  type="number"
                  name="numberOfFlutes"
                  value={form.numberOfFlutes}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Flute Length */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Flute length
                </label>
                <input
                  type="number"
                  name="fluteLength"
                  value={form.fluteLength}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Step Lengths */}
              {["stepLength1", "stepLength2", "stepLength3"].map((key, i) => (
                <div className="flex flex-col" key={key}>
                  <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                    Step length {i + 1}
                  </label>
                  <input
                    type="number"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                  />
                </div>
              ))}

              {/* Helix Angle */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Helix angle
                </label>
                <input
                  type="number"
                  name="helixAngle"
                  value={form.helixAngle}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Total Length */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Total length
                </label>
                <input
                  type="number"
                  name="totalLength"
                  value={form.totalLength}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Shank Diameter */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Shank diameter
                </label>
                <input
                  type="number"
                  name="shankDiameter"
                  value={form.shankDiameter}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                />
              </div>

              {/* Coolant thru */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Coolant thru?
                </label>
                <select
                  name="coolantThru"
                  value={form.coolantThru}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select ---</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              {/* Shank / Body */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Carbide or steel shank/body
                </label>
                <select
                  name="shankBodyType"
                  value={form.shankBodyType}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select ---</option>
                  <option value="Carbide">Carbide</option>
                  <option value="Steel">Steel</option>
                </select>
              </div>

              {/* PCD center cutting */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  PCD center cutting?
                </label>
                <select
                  name="pcdCenterCutting"
                  value={form.pcdCenterCutting}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select ---</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </select>
              </div>

              {/* Sandwich / Corner Brazed */}
              <div className="flex flex-col">
                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                  Sandwich or corner brazed
                </label>
                <select
                  name="sandwichOrCorner"
                  value={form.sandwichOrCorner}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
                >
                  <option value="">--- Select ---</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Corner Brazed">Corner Brazed</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                  Coating
                </label>
                <select
                  name="Coating"
                  value={form.Coating}
                  onChange={handleChange}
                  className="w-full border border-l-4  border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
                >
                  <option value="">--- Select Coating ---</option>
                  <option value="TiAlN">TiAlN (FUTURA)</option>
                  <option value="AlTiN">AlTiN (LATUMA)</option>
                  <option value="TiN(A)">TiN (A)</option>
                  <option value="TiCN(B)">TiCN (B)</option>
                  <option value="DLC"> DLC (HARDCARBON*)</option>
                  <option value="AlCrN">AlCrN (AlCrN)</option>
                </select>
              </div>
              {[
                ...(role !== "Engineers" ? [["Sales Price", "price"]] : []),
                ...(role !== "Sale" ? [["Cost", "cost"]] : []),
              ].map(([label, name]) => (
                <div key={name} className="flex flex-col">
                  <label className="block text-black text-[12px] md:text-lg font-semibold mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg text-black px-3 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3] transition"
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
                className=" cursor-pointer px-10 py-3 bg-[#1C70D3] text-white rounded-full text-lg font-medium shadow-md hover:bg-[#0A4EA3] hover:shadow-xl transition"
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

export default DrillMockUp;
