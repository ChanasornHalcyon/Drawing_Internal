import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalStartWork from "../components/ModalStartWork";
import ModalProblemForm from "../components/ModalProblemForm";
import ModalCompleteForm from "../components/ModalCompleteForm";

const Approve_Form = () => {
    const [itData, setItData] = useState([]);
    const [fixData, setFixData] = useState([]);
    const [loadingIT, setLoadingIT] = useState(true);
    const [loadingFix, setLoadingFix] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFormType, setSelectedFormType] = useState(null);

    const loadIT = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getApproveITForm");
            if (res.data.success) setItData(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIT(false);
        }
    };


    const loadFix = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getApproveFixForm");
            if (res.data.success) {
                setFixData(
                    res.data.data.map((item) => ({
                        ...item,
                        form_type: "FIX",
                    }))
                );
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingFix(false);
        }
    };


    const updateStatus = async (id, status) => {
        const username = localStorage.getItem("username") || "";
        await axios.put(`http://localhost:4000/updateStatus/${id}`, {
            status,
            username,
            form_type: selectedFormType,
        });

        loadIT();
        loadFix();
    };

    const markProblem = async (id, detail) => {
        try {
            const username = localStorage.getItem("username") || "";
            await axios.put(`http://localhost:4000/updateStatus/${id}`, {
                status: "PROBLEM",
                problem_detail: detail,
                username,
                form_type: selectedFormType,
            });

            loadIT();
            loadFix();

            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false };
        }
    };

    useEffect(() => {
        loadIT();
        loadFix();
    }, []);

    return (
        <div className="container mx-auto max-w-[1920px] bg-[#F8F8FF] min-h-screen">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32 pb-16">
                <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
                    รอดำเนินการร้องขอ IT
                </h2>

                <div className="overflow-x-auto mb-16">
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
                            {loadingIT ? (
                                <tr><td colSpan="9" className="text-center py-6">กำลังโหลด...</td></tr>
                            ) : itData.length === 0 ? (
                                <tr><td colSpan="9" className="text-center py-6">ไม่มีข้อมูล</td></tr>
                            ) : (
                                itData.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                                        <td className="px-4 py-2">{new Date(item.created_at).toLocaleString("th-TH")}</td>
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

                                        <td className="px-4 py-2 flex gap-2">
                                            {item.status === "APPROVED" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("IT");
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg cursor-pointer text-nowrap"
                                                >
                                                    เริ่มงาน
                                                </button>
                                            )}

                                            {item.status === "IN_PROGRESS" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("IT");
                                                        setShowCompleteModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-lg cursor-pointer text-nowrap"
                                                >
                                                    เสร็จงาน
                                                </button>
                                            )}

                                            {item.status !== "COMPLETE" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("IT");
                                                        setShowProblemModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg cursor-pointer text-nowrap"
                                                >
                                                    ติดปัญหา
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>



                <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
                    รอดำเนินการแจ้งซ่อม IT
                </h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">แผนก</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">รายละเอียด</th>
                                <th className="px-4 py-3 text-start">อุปกรณ์</th>
                                <th className="px-4 py-3 text-start">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingFix ? (
                                <tr><td colSpan="7" className="text-center py-6">กำลังโหลด...</td></tr>
                            ) : fixData.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-6">ไม่มีข้อมูล</td></tr>
                            ) : (
                                fixData.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50">
                                        <td className="px-4 py-2">{new Date(item.created_at).toLocaleString("th-TH")}</td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.tools}</td>

                                        <td className="px-4 py-2 flex gap-2">
                                            {item.status === "APPROVED" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("FIX");
                                                        setShowModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg cursor-pointer text-nowrap"
                                                >
                                                    เริ่มงาน
                                                </button>
                                            )}

                                            {item.status === "IN_PROGRESS" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("FIX");
                                                        setShowCompleteModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-lg  cursor-pointer text-nowrap"
                                                >
                                                    เสร็จงาน
                                                </button>
                                            )}

                                            {item.status !== "COMPLETE" && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setSelectedFormType("FIX");
                                                        setShowProblemModal(true);
                                                    }}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg  cursor-pointer text-nowrap"
                                                >
                                                    ติดปัญหา
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>


            {showModal && (
                <ModalStartWork
                    item={selectedItem}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        updateStatus(selectedItem.id, "IN_PROGRESS");
                        setShowModal(false);
                    }}
                />
            )}

            {showProblemModal && (
                <ModalProblemForm
                    item={selectedItem}
                    onClose={() => setShowProblemModal(false)}
                    onSubmitProblem={(txt) => markProblem(selectedItem.id, txt)}
                />
            )}

            {showCompleteModal && (
                <ModalCompleteForm
                    item={selectedItem}
                    onClose={() => setShowCompleteModal(false)}
                    onConfirm={() => {
                        updateStatus(selectedItem.id, "COMPLETE");
                        setShowCompleteModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Approve_Form;
