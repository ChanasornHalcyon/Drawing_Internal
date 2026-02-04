import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalDetailProblem from "../components/ModalDetailProblem";
import SearchFormIT from "../components/SearchFormIT";
import SearchFormFixIT from "../components/SearchFormFixIT";

const Problem_Form = () => {
    const [itProblems, setItProblems] = useState([]);
    const [fixProblems, setFixProblems] = useState([]);
    const [loadingIT, setLoadingIT] = useState(true);
    const [loadingFix, setLoadingFix] = useState(true);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchIT, setSearchIT] = useState("");
    const [searchFix, setSearchFix] = useState("");

    const loadData = async () => {
        try {
            const [itRes, fixRes] = await Promise.all([
                axios.get("http://localhost:4000/getProblemForm"),
                axios.get("http://localhost:4000/getProblemFixForm"),
            ]);

            if (itRes.data.success) setItProblems(itRes.data.data);
            if (fixRes.data.success) setFixProblems(fixRes.data.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIT(false);
            setLoadingFix(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    const filteredIT = itProblems.filter((item) =>
        [item.requester, item.department, item.purpose, item.detail, item.problem_by]
            .join(" ")
            .toLowerCase()
            .includes(searchIT.toLowerCase())
    );


    const filteredFixProblems = fixProblems.filter((item) =>
        [item.requester, item.department, item.purpose, item.detail, item.problem_by]
            .join(" ")
            .toLowerCase()
            .includes(searchFix.toLowerCase())
    );

    const openDetailModal = (item) => {
        setSelectedProblem(item);
        setShowDetailModal(true);
    };

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF]">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32 pb-20">

                {/* ---------------- IT SECTION ---------------- */}
                <div className="flex flex-col items-center gap-4 mb-8 px-4">
                    <h1 className="text-2xl font-bold text-black text-center">
                        รายการร้องขอที่ติดปัญหา
                    </h1>

                    <div className="w-full max-w-xl">
                        <SearchFormIT searchValue={searchIT} setSearchValue={setSearchIT} />
                    </div>
                </div>

                {/* IT TABLE */}
                <div className="overflow-x-auto max-h-[500px]  overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-left ">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-left">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-left">แผนก</th>
                                <th className="px-4 py-3 text-left">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-left">รายละเอียด</th>
                                <th className="px-4 py-3 text-left">เวลาที่เกิดปัญหา</th>
                                <th className="px-4 py-3 text-left">ผู้รับผิดชอบ</th>
                                <th className="px-4 py-3  text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingIT ? (
                                <tr><td colSpan="8" className="text-center py-6">กำลังโหลดข้อมูล...</td></tr>
                            ) : filteredIT.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-6">ไม่มีข้อมูล</td></tr>
                            ) : (
                                filteredIT.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-red-50">
                                        <td className="px-4 py-2">{new Date(item.created_at).toLocaleString("th-TH")}</td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.problem_at ? new Date(item.problem_at).toLocaleString("th-TH") : "-"}</td>
                                        <td className="px-4 py-2">{item.problem_by || "-"}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => openDetailModal(item)}
                                                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white border"
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

                {/* ---------------- FIX SECTION ---------------- */}
                <div className="flex flex-col items-center gap-4 mb-8 px-4">
                    <h1 className="text-2xl font-bold text-black text-center">
                        รายการแจ้งซ่อมที่ติดปัญหา
                    </h1>

                    <div className="w-full max-w-xl">
                        <SearchFormFixIT searchValue={searchFix} setSearchValue={setSearchFix} />
                    </div>
                </div>

                {/* FIX TABLE */}
                <div className="overflow-x-auto max-h-[500px]  overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-left">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-left">แผนก</th>
                                <th className="px-4 py-3 text-left">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-left">รายละเอียด</th>
                                <th className="px-4 py-3 text-left">เวลาที่เกิดปัญหา</th>
                                <th className="px-4 py-3 text-left">ผู้รับผิดชอบ</th>
                                <th className="px-4 py-3  text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingFix ? (
                                <tr><td colSpan="8" className="text-center py-6">กำลังโหลดข้อมูล...</td></tr>
                            ) : filteredFixProblems.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-6">ไม่มีข้อมูล</td></tr>
                            ) : (
                                filteredFixProblems.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-red-50">
                                        <td className="px-4 py-2">{new Date(item.created_at).toLocaleString("th-TH")}</td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.problem_at ? new Date(item.problem_at).toLocaleString("th-TH") : "-"}</td>
                                        <td className="px-4 py-2">{item.problem_by || "-"}</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => openDetailModal(item)}
                                                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white border"
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

            {showDetailModal && (
                <ModalDetailProblem item={selectedProblem} onClose={() => setShowDetailModal(false)} />
            )}
        </div>
    );
};

export default Problem_Form;
