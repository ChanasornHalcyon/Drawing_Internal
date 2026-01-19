import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalPendingForm from "../components/ModalPendingForm";
import ModalRejectForm from "../components/ModalRejectForm";

const Pending_Form = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalApprove, setShowModalApprove] = useState(false);
    const [showModalReject, setShowModalReject] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleApproveSuccess = (id) => {
        setData((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: "APPROVED" } : item
            )
        );
    };

    const onSubmitReject = async (id, reason) => {
        try {
            const res = await axios.post("http://localhost:4000/rejectITForm", {
                id,
                reason,
                username: localStorage.getItem("username")
            });

            if (res.data.success) {
                setData(prev =>
                    prev.map(item =>
                        item.id === id
                            ? {
                                ...item,
                                status: "REJECTED",
                                problem_detail: reason,
                                problem_by: localStorage.getItem("username"),
                                problem_at: new Date().toISOString()
                            }
                            : item
                    )
                );
            }

            return res.data;
        } catch (err) {
            console.error(err);
            return { success: false };
        }
    };


    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getITForm");
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32">
                <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-start">วันที่ต้องการ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">แผนก</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">รายละเอียด</th>
                                <th className="px-4 py-3 text-start">เหตุผล</th>
                                <th className="px-4 py-3 text-start">Spec</th>
                                <th className="px-4 py-3 text-start">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-6 text-gray-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                                        <td className="px-4 py-2">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleString("th-TH", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.required_date
                                                ? new Date(item.required_date).toLocaleDateString("th-TH")
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.reason}</td>
                                        <td className="px-4 py-2">{item.spec}</td>

                                        <td className="px-4 py-2">
                                            {item.status === "APPROVED" ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg">
                                                    อนุมัติ
                                                </span>
                                            ) : item.status === "REJECTED" ? (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg">
                                                    ไม่อนุมัติ
                                                </span>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowModalApprove(true);
                                                        }}
                                                        className="px-3 py-1 bg-pink-500 text-white rounded-lg cursor-pointer"
                                                    >
                                                        รออนุมัติ
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setShowModalReject(true);
                                                        }}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded-lg cursor-pointer"
                                                    >
                                                        ไม่อนุมัติ
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-6 text-gray-500">
                                        ไม่มีข้อมูลในระบบ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModalApprove && (
                <ModalPendingForm
                    data={selectedItem}
                    onApprove={handleApproveSuccess}
                    onClose={() => {
                        setShowModalApprove(false);
                        setSelectedItem(null);
                    }}
                />
            )}

            {showModalReject && (
                <ModalRejectForm
                    item={selectedItem}
                    onClose={() => {
                        setShowModalReject(false);
                        setSelectedItem(null);
                    }}
                    onSubmitReject={onSubmitReject}
                />
            )}
        </div>
    );
};

export default Pending_Form;
