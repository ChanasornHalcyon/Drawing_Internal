import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalDetailProblem from "../components/ModalDetailProblem";

const Problem_Form = () => {
    const [itProblems, setItProblems] = useState([]);
    const [fixProblems, setFixProblems] = useState([]);
    const [loadingIT, setLoadingIT] = useState(true);
    const [loadingFix, setLoadingFix] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);


    const loadITProblems = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getProblemForm");
            if (res.data.success) {
                setItProblems(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIT(false);
        }
    };

    // Load FIX problems
    const loadFixProblems = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getProblemFixForm");
            if (res.data.success) {
                setFixProblems(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingFix(false);
        }
    };


    const openDetailModal = (item) => {
        setSelectedProblem(item);
        setShowDetailModal(true);
    };

    useEffect(() => {
        loadITProblems();
        loadFixProblems();
    }, []);

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF]">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32 pb-20">


                <h1 className="text-2xl font-bold mb-5 text-black text-center">
                    รายการร้องขอที่ติดปัญหา
                </h1>

                <div className="overflow-x-auto mb-16">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-left">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-left">แผนก</th>
                                <th className="px-4 py-3 text-left">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-left">รายละเอียด</th>
                                <th className="px-4 py-3 text-left">เวลาที่เกิดปัญหา</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingIT ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">กำลังโหลดข้อมูล...</td>
                                </tr>
                            ) : itProblems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">ไม่มีข้อมูล</td>
                                </tr>
                            ) : (
                                itProblems.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-red-50 transition">
                                        <td className="px-4 py-2">
                                            {new Date(item.created_at).toLocaleString("th-TH")}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">
                                            {item.problem_at
                                                ? new Date(item.problem_at).toLocaleString("th-TH")
                                                : "-"}
                                        </td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => openDetailModal(item)}
                                                className="px-3 py-1 rounded-lg  
                                                bg-blue-100 text-blue-600 
                                                hover:bg-blue-600 hover:text-white 
                                                transition border border-blue-200 cursor-pointer"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="my-12 border-t border-gray-800 border-dashed"></div>

                <h1 className="text-2xl font-bold mb-5 text-black text-center">
                    รายการแจ้งซ่อมที่ติดปัญหา
                </h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-left">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-left">แผนก</th>
                                <th className="px-4 py-3 text-left">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-left">รายละเอียด</th>
                                <th className="px-4 py-3 text-left">เวลาที่เกิดปัญหา</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingFix ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">กำลังโหลดข้อมูล...</td>
                                </tr>
                            ) : fixProblems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6">ไม่มีข้อมูล</td>
                                </tr>
                            ) : (
                                fixProblems.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-red-50 transition">
                                        <td className="px-4 py-2">
                                            {new Date(item.created_at).toLocaleString("th-TH")}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">
                                            {item.problem_at
                                                ? new Date(item.problem_at).toLocaleString("th-TH")
                                                : "-"}
                                        </td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => openDetailModal(item)}
                                                className="px-3 py-1 rounded-lg 
                                                bg-blue-100 text-blue-600 
                                                hover:bg-blue-600 hover:text-white 
                                                transition border border-blue-200 cursor-pointer"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ---------------- MODAL ---------------- */}
            {showDetailModal && (
                <ModalDetailProblem
                    item={selectedProblem}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
};

export default Problem_Form;
