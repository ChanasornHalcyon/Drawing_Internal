import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFileExcel } from "react-icons/fa6";
import axios from "axios";

const ModalImportExcel = ({ onClose, refreshData }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImport = async () => {
        if (!file) {
            alert("กรุณาเลือกไฟล์ Excel");
            return;
        }

        const formData = new FormData();
        formData.append("excel", file);

        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:4000/importExcel",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                alert("Import Excel Complete ");
                refreshData?.();
                onClose();
            } else {
                alert(res.data.message || "นำเข้าไม่สำเร็จ");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด");
        } finally {
            setLoading(false);
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
                <div className="bg-white rounded-2xl shadow-xl w-[360px] sm:w-[440px] md:w-[500px] max-h-[90vh] overflow-y-auto">

                    <div className="flex justify-between items-center p-5 border-b bg-white sticky top-0 shadow-sm">
                        <h5 className="text-2xl font-semibold text-black">
                            Import Excel File
                        </h5>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>


                    <div className="p-6 space-y-5">

                        <label className="block text-sm text-gray-700 mb-1">
                            เลือกไฟล์ Excel
                        </label>

                        <input
                            id="excelInput"
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleChange}
                            className="hidden"
                        />

                        <div
                            onClick={() => document.getElementById("excelInput").click()}
                            className="flex gap-3 items-center px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition"
                        >

                            {file ? file.name : "Choose File"}
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 p-5 border-t bg-white sticky bottom-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 text-black hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50"
                        >
                            {loading ? "Importing..." : "Import"}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                animate={{ opacity: 0.5 }}
                onClick={onClose}
            />
        </>
    );
};

export default ModalImportExcel;
