import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Upload } from "lucide-react";

const ModalCompleteForm = ({ item, onClose, onConfirm }) => {
    if (!item) return null;
    const [fixDetail, setFixDetail] = useState("");
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("status", "COMPLETE");
    formData.append("username", localStorage.getItem("username") || "");
    formData.append("completed_detail", fixDetail);
    images.forEach((img) => {
        formData.append("images", img);
    });

   const result = await onConfirm(formData);

if (result?.success) {
    alert("อัปโหลดเสร็จสมบูรณ์");
    onClose();
} else {
    alert("เกิดข้อผิดพลาดในการอัปโหลด");
}
};



    return (
        <>
            <motion.div
                className="fixed inset-0 z-50 flex justify-center items-start mt-14 px-4"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

                    <div className="p-6 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={26} />
                            <h2 className="text-xl font-semibold text-gray-800 ">
                                ยืนยันการเสร็จงาน
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>


                    <div className="p-6 space-y-5 text-gray-700">


                        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
                            <Info label="ผู้ร้องขอ" value={item.requester} />
                            <Info label="แผนก" value={item.department} />
                            <Info label="วัตถุประสงค์" value={item.purpose} />
                            <Info label="รายละเอียด" value={item.detail} />
                        </div>


                        <div>
                            <label className="font-semibold">สิ่งที่แก้ไขไปแล้ว</label>
                            <textarea
                                className="w-full p-3 mt-1 border rounded-xl bg-gray-50 text-gray-700 h-28 outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="กรอกรายละเอียดสิ่งที่แก้ไข…"
                                value={fixDetail}
                                onChange={(e) => setFixDetail(e.target.value)}
                            />
                        </div>


                        <div>
                            <label className="font-semibold">อัพโหลดรูปภาพ</label>

                            <div className="mt-2 p-4 border border-dashed rounded-xl bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <Upload className="text-gray-500" size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="text-sm"
                                    />
                                </div>


                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                        {images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(img)}
                                                alt="preview"
                                                className="h-20 w-full object-cover rounded-lg border"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="p-5 border-t flex justify-end gap-3 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                            ยืนยันเสร็จงาน
                        </button>
                    </div>
                </div>
            </motion.div>


            <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        </>
    );
};

const Info = ({ label, value }) => (
    <div className="flex items-start gap-3">
        <div className="w-28 text-gray-500">{label}</div>
        <div className="font-medium text-gray-800 break-words">{value || "-"}</div>
    </div>
);

export default ModalCompleteForm;
