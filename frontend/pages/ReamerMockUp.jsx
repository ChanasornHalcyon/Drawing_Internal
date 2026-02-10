import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarDrawing from "../components/NavbarDrawing";
import { FaFilePdf } from "react-icons/fa6";


const InputField = ({ form, handleChange, label, name }) => (
    <div className="flex flex-col">
        <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
            {label}
        </label>
        <input
            type="number"
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
        />
    </div>
);

const SelectField = ({ form, handleChange, label, name, options }) => (
    <div className="flex flex-col">
        <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
            {label}
        </label>
        <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg text-black px-3 py-2 shadow-sm focus:border-[#1C70D3]"
        >
            <option value="">--- Select ---</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    </div>
);



const ReamerMockUp = () => {
    const [form, setForm] = useState({
        customerName: "",
        date: "",
        drawingNo: "",
        rev: "",
        customerPart: "",
        description: "",
        numberOfSteps: "",
        diameter1: "",
        diameter2: "",
        diameter3: "",
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
        shankType: "",
        holderType: "",
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

    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [role, setRole] = useState("");
    const [checkDrawigs, setCheckDrawings] = useState(false);

    // ------------------------------
    // Handle change
    // ------------------------------
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            const file = files[0];
            setForm({ ...form, file });

            const isImage = file?.type?.startsWith("image/");
            const isPDF = file?.type === "application/pdf";
            setFileType(isImage ? "image" : isPDF ? "pdf" : "other");

            setPreview(isImage ? URL.createObjectURL(file) : isPDF ? file.name : null);
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // ------------------------------
    // Submit
    // ------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            formData.append("username", localStorage.getItem("username") || "Unknown");

            const res = await axios.post("http://localhost:9000/pushData", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                alert("Submit Successfully!");
                setForm((prev) => ({
                    ...prev,
                    customerName: "",
                    date: "",
                    drawingNo: "",
                    rev: "",
                    customerPart: "",
                    description: "",
                    price: "",
                    cost: "",
                    file: null,
                }));
                setPreview(null);
            } else {
                alert("Submit Failed!");
            }
        } catch (err) {
            console.error("Submit error:", err);
            alert("Server Error!");
        }
    };

    // ------------------------------
    // Check duplicate Drawing No.
    // ------------------------------
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
                <div className="flex py-10 px-4 justify-center">

                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-14 mt-20"
                    >
                        <h1 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
                            Reamer Drawing
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
                                className="w-full border border-l-4 border-l-red-500 border-gray-300 rounded-lg px-4 py-2 text-gray-800 shadow-sm focus:border-[#1C70D3]"
                            >
                                <option value="">--- Select Drawing ---</option>

                                <option value="CDR CARBIDE DRILL STRAIGTH" data-img="Drawing1.png">
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
                                <option value="DDRS PCD SOLID DRILL STRAIGTH" data-img="Drawing5.png">
                                    DDRS PCD SOLID DRILL STRAIGTH
                                </option>
                                <option value="DDRS PCD SOLID DRILL HELIX" data-img="Drawing6.png">
                                    DDRS PCD SOLID DRILL HELIX
                                </option>
                                <option value="DDRW PCD SANDWICH DRILL" data-img="Drawing7.png">
                                    DDRW PCD SANDWICH DRILL
                                </option>
                                <option value="DDRW PCD SANDWICH DRILL HELIX" data-img="Drawing8.png">
                                    DDRW PCD SANDWICH DRILL HELIX
                                </option>
                            </select>
                        </div>

                        {/* Drawing Preview */}
                        {form.img && (
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={`/${form.img}`}
                                    className="w-[380px] h-auto object-contain rounded-xl shadow-lg border bg-white p-2"
                                    alt="Drawing Preview"
                                />
                            </div>
                        )}


                        <div className="grid grid-cols-2 gap-5 mt-5">
                            <div className="flex flex-col">
                                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
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
                                    className={`w-full border rounded-lg text-black px-3 py-2 ${checkDrawigs
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
                                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={form.customerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
                                />
                            </div>

                            {[
                                ["Rev", "rev"],
                                ["Customer Part No.", "customerPart"],
                                ["Description", "description"],
                            ].map(([label, name]) => (
                                <div key={name} className="flex flex-col">
                                    <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* ------------------------------
                DRAWING SPEC ZONE
            ------------------------------ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                            <InputField form={form} handleChange={handleChange} label="Number of steps" name="numberOfSteps" />

                            {/* Diameters */}
                            {["diameter1", "diameter2", "diameter3"].map((key, i) => (
                                <InputField
                                    key={key}
                                    form={form}
                                    handleChange={handleChange}
                                    label={`Diameter ${i + 1}`}
                                    name={key}
                                />
                            ))}

                            <InputField form={form} handleChange={handleChange} label="Number of flutes" name="numberOfFlutes" />
                            <InputField form={form} handleChange={handleChange} label="Flute length" name="fluteLength" />


                            {["stepLength1", "stepLength2", "stepLength3"].map((key, i) => (
                                <InputField
                                    key={key}
                                    form={form}
                                    handleChange={handleChange}
                                    label={`Step length ${i + 1}`}
                                    name={key}
                                />
                            ))}

                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Carbide or PCD?"
                                name="materialType"
                                options={["Carbide", "PCD"]}
                            />

                            <InputField form={form} handleChange={handleChange} label="Helix angle" name="helixAngle" />

                            <InputField form={form} handleChange={handleChange} label="Total length" name="totalLength" />


                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Shank Type"
                                name="shankType"
                                options={["Straight shank", "Shrink fit", "Monoblock"]}
                            />

                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Holder Type"
                                name="holderType"
                                options={["HSK63A", "BT30", "BT40", "Module 60", "Module 70", "Module 80"]}
                            />

                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Coolant thru?"
                                name="coolantThru"
                                options={["YES", "NO"]}
                            />

                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Carbide or steel shank/body?"
                                name="shankBodyType"
                                options={["Carbide", "Steel"]}
                            />

                            <SelectField
                                form={form}
                                handleChange={handleChange}
                                label="Coating"
                                name="Coating"
                                options={[
                                    "TiAlN (FUTURA)",
                                    "AlTiN (LATUMA)",
                                    "TiN(A)",
                                    "TiCN(B)",
                                    "DLC (HARDCARBON*)",
                                    "AlCrN (AlCrN)",
                                ]}
                            />


                            {[
                                ...(role !== "Engineers" ? [["Sales Price", "price"]] : []),
                                ...(role !== "Sale" ? [["Cost", "cost"]] : []),
                            ].map(([label, name]) => (
                                <div key={name} className="flex flex-col">
                                    <label className="text-black mb-1 font-semibold text-[12px] md:text-lg">
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
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
                                                <p className="text-blue-600 mt-3 font-medium">{preview}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">Unsupported file type</p>
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
                                className="px-10 py-3 bg-[#1C70D3] text-white rounded-full text-lg font-medium shadow-md hover:bg-[#0A4EA3] hover:shadow-xl"
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

export default ReamerMockUp;
