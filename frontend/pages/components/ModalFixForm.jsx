import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ModalFixForm = ({ onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        purpose: "",
        detail: "",
        requester: "",
        request_date: "",
        department: "",
        required_date: "",
        tools: [],
    });

    const PURPOSE_OPTIONS = [
        "Software",
        "Software Mashine",
        "HardWare",
        "HardWare Mashine",
        "Network",
        "อื่น ๆ",
    ];

    const TOOL_OPTIONS = [
        "Computer PC",
        "Computer Notebook",
        "Printer/Scan",
        "Monitor",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTool = (tool) => {
        setForm((prev) => ({
            ...prev,
            tools: prev.tools.includes(tool)
                ? prev.tools.filter((t) => t !== tool)
                : [...prev.tools, tool],
        }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await axios.post("http://localhost:8000/ITFixForm", {
                ...form,
                tools: form.tools.join(", "),
            });
            alert("ส่งฟอร์มสำเร็จ");
            onClose();
        } catch (err) {
            console.error(err);
            alert("ส่งไม่สำเร็จ");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const uname = localStorage.getItem("username") || "";
        const department = localStorage.getItem("department") || "";
        const today = new Date().toISOString().split("T")[0];

        setForm((prev) => ({
            ...prev,
            requester: uname,
            department: department,
            request_date: today,
        }));
    }, []);

    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-10"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-[350px] sm:w-[520px] md:w-[500px] rounded-2xl shadow-xl">
                    <div className="p-5 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-black">แบบฟอร์มแจ้งซ่อมอุปกรณ์ IT</h2>
                        <button onClick={onClose} className="text-2xl text-black cursor-pointer">✕</button>
                    </div>

                    <div className="p-6 space-y-5 text-sm">

                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-black">วัตถุประสงค์</label>
                            <select
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                                className="p-2 border rounded-lg text-black bg-white"
                            >
                                <option value="">-- เลือกวัตถุประสงค์ --</option>
                                {PURPOSE_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {form.purpose === "HardWare" && (
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-black">อุปกรณ์</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {TOOL_OPTIONS.map((tool) => (
                                        <label key={tool} className="flex items-center gap-2 text-black">
                                            <input
                                                type="checkbox"
                                                checked={form.tools.includes(tool)}
                                                onChange={() => toggleTool(tool)}
                                            />
                                            {tool}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-black">อาการเบื้องต้น</label>
                            <input
                                type="text"
                                name="detail"
                                onChange={handleChange}
                                className="p-2 border rounded-lg text-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-black">ผู้ร้องขอ</label>
                                <input
                                    value={form.requester}
                                    readOnly
                                    className="p-2 border rounded-lg bg-gray-100 text-black"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-black">แผนก / ฝ่าย</label>
                                <input
                                    value={form.department}
                                    readOnly
                                    className="p-2 border rounded-lg bg-gray-100 text-black"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-black">วันที่ร้องขอ</label>
                                <input
                                    type="date"
                                    value={form.request_date}
                                    readOnly
                                    className="p-2 border rounded-lg bg-gray-100 text-black"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-black">วันที่ต้องการ</label>
                                <input
                                    type="date"
                                    name="required_date"
                                    onChange={handleChange}
                                    className="p-2 border rounded-lg text-black cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg text-black cursor-pointer"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                        >
                            {submitting ? "กำลังส่ง..." : "ส่งฟอร์ม"}
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        </>
    );
};

export default ModalFixForm;