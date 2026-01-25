import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ModalITForm = ({ onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        purpose: "",
        detail: "",
        reason: "",
        spec: "",
        requester: "",
        request_date: "",
        department: "",
        required_date: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await axios.post("http://localhost:4000/ITForm", form);
            alert("ส่งฟอร์มสำเร็จ");
            onClose();
        } catch (err) {
            console.error(err);
            alert("บันทึกไม่สำเร็จ");
        } finally {
            setSubmitting(false);
        }
    };

    const PURPOSE_OPTIONS = [
        "ขอรหัส Wifi",
        "ร้องขอ User",
        "จัดซื้ออุปกรณ์ IT",
        "ขอสิทธิ์การใช้งานระบบ",
        "ติดตั้งโปรแกรม",
        "ปรับปรุงระบบ",
        "อื่น ๆ",

    ];

    useEffect(() => {
        const department = localStorage.getItem("department") || "";
        const fname = localStorage.getItem("fname") || "";
        const lname = localStorage.getItem("lname") || "";

        const today = new Date().toISOString().split("T")[0];

        setForm((prev) => ({
            ...prev,
            requester: `${fname} ${lname}`,
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
                <div className="bg-white w-[380px] sm:w-[520px] md:w-[500px] rounded-2xl shadow-xl">
                    <div className="p-5 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-black">แบบฟอร์มร้องขอฝ่าย IT</h2>
                        <button onClick={onClose} className="text-2xl text-gray-500 cursor-pointer">✕</button>
                    </div>
                    <div className="p-6 space-y-5">
                        <label className="font-semibold text-black">วัตถุประสงค์</label>
                        <select
                            name="purpose"
                            value={form.purpose}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg text-black bg-white"
                        >
                            <option value="">-- เลือกวัตถุประสงค์ --</option>
                            {PURPOSE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                        {[
                            ["รายละเอียดการร้องขอ", "detail"],
                            ["เหตุผลหรือความจำเป็น", "reason"],
                            ["มาตรฐานหรือ Spec ที่ต้องการ", "spec"],
                        ].map(([label, name]) => (
                            <div key={name}>
                                <label className="font-semibold text-black">{label}</label>
                                <input
                                    type="text"
                                    name={name}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-lg text-black"
                                />
                            </div>
                        ))}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-black">ชื่อผู้ร้องขอ</label>
                                <input
                                    value={form.requester}
                                    readOnly
                                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-black">แผนก / ฝ่าย</label>
                                <input
                                    value={form.department}
                                    readOnly
                                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-black">วันที่ร้องขอ</label>
                                <input
                                    type="date"
                                    value={form.request_date}
                                    readOnly
                                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-black">วันที่ต้องการ</label>
                                <input
                                    type="date"
                                    name="required_date"
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-lg text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 border-t flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-black bg-gray-200 rounded-lg cursor-pointer">
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                        >
                            {submitting ? "กำลังส่งฟอร์ม..." : "ส่งฟอร์ม"}
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        </>
    );
};

export default ModalITForm;