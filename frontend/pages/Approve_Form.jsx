import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalCompleteForm from "../components/ModalCompleteForm";
import ModalProblemForm from "../components/ModalProblemForm";
const Approve_Form = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [selectedProblemItem, setSelectedProblemItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const openProblemModal = (item) => {
        setSelectedProblemItem(item);
        setShowProblemModal(true);
    };

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getApproveForm");
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus, username) => {
        try {
            await axios.put(`http://localhost:4000/updateStatus/${id}`, {
                status: newStatus,
                username: username,
            });

            getData();
        } catch (err) {
            console.error(err);
        }
    };
    const markProblem = async (id, problem_detail) => {
        try {
            const username = localStorage.getItem("username") || "";

            await axios.post(`http://localhost:4000/markProblem/${id}`, {
                problem_detail,
                problem_by: username,
            });

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false };
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
                                    <tr
                                        key={item.id}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                    >
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
                                        <td className="px-4 py-2 flex items-center gap-2">

                                            {item.status === "COMPLETE" ? (
                                                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">
                                                    Completed
                                                </span>
                                            ) : (

                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
                                                >
                                                    Complete
                                                </button>


                                            )}
                                            <button
                                                onClick={() => openProblemModal(item)}
                                                className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                                            >
                                                Problem
                                            </button>
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
            {showModal && (
                <ModalCompleteForm
                    item={selectedItem}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        updateStatus(selectedItem.id, "COMPLETE", localStorage.getItem("username"));
                        setShowModal(false);
                    }}
                />
            )}
            {showProblemModal && (
                <ModalProblemForm
                    item={selectedProblemItem}
                    onClose={() => setShowProblemModal(false)}
                    onSubmitProblem={markProblem}
                    refreshData={getData}
                />
            )}
        </div>
    );
};

export default Approve_Form;