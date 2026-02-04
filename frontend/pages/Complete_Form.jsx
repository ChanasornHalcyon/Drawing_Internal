import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import DetailModal from "../components/DetailModal";
import SearchFormIT from "../components/SearchFormIT";
import SearchFormFixIT from "../components/SearchFormFixIT";
const Complete_Form = () => {
    const [itComplete, setItComplete] = useState([]);
    const [fixComplete, setFixComplete] = useState([]);
    const [loadingIT, setLoadingIT] = useState(true);
    const [loadingFix, setLoadingFix] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchIT, setSearchIT] = useState("");
    const [searchFix, setSearchFix] = useState("");

    const getAllComplete = async () => {
        setLoadingIT(true);
        setLoadingFix(true);

        try {
            const [itRes, fixRes] = await Promise.all([
                axios.get("http://localhost:4000/getCompleteForm"),
                axios.get("http://localhost:4000/getCompleteFixForm"),
            ]);

            if (itRes.data.success) {
                setItComplete(itRes.data.data);
            }

            if (fixRes.data.success) {
                setFixComplete(fixRes.data.data);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIT(false);
            setLoadingFix(false);
        }
    };

    const filteredITComplete = itComplete.filter((item) => {
        const q = searchIT.toLowerCase();
        return (
            item.requester?.toLowerCase().includes(q) ||
            item.department?.toLowerCase().includes(q) ||
            item.purpose?.toLowerCase().includes(q) ||
            item.detail?.toLowerCase().includes(q) ||
            item.completed_by?.toLowerCase().includes(q)
        );
    });

    const filteredFixComplete = fixComplete.filter((item) => {
        const q = searchFix.toLowerCase();
        return (
            item.requester?.toLowerCase().includes(q) ||
            item.department?.toLowerCase().includes(q) ||
            item.purpose?.toLowerCase().includes(q) ||
            item.detail?.toLowerCase().includes(q) ||
            item.completed_by?.toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        getAllComplete();
    }, []);

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32 pb-20">

                <div className="flex flex-col items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-black text-center">
                        รายการร้องขอที่สำเร็จ
                    </h1>

                    <div className="w-full max-w-xl">
                        <SearchFormIT searchValue={searchIT} setSearchValue={setSearchIT} />
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[500px]  overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">แผนก</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">รายละเอียด</th>
                                <th className="px-4 py-3 text-start">เหตุผล</th>
                                <th className="px-4 py-3 text-start">ผู้รับผิดชอบ</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingIT ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-6 text-gray-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : filteredITComplete.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-6 text-gray-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                filteredITComplete.map((item) => (
                                    <tr key={item.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                                        <td className="px-4 py-2">
                                            {new Date(item.created_at).toLocaleString("th-TH")}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.reason}</td>
                                        <td className="px-4 py-2">{item.completed_by || "-"}</td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setShowDetail(true);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition border cursor-pointer"
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
                <div className="flex flex-col items-center gap-4 mb-8">
                    <h1 className="text-2xl font-bold text-black text-center">
                        รายการแจ้งซ่อมที่สำเร็จ
                    </h1>

                    <div className="w-full max-w-xl">
                        <SearchFormFixIT searchValue={searchFix} setSearchValue={setSearchFix} />
                    </div>
                </div>

                <div className="overflow-x-auto max-h-[500px]  overflow-y-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">แผนก</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">รายละเอียด</th>
                                <th className="px-4 py-3 text-start">ผู้รับผิดชอบ</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loadingFix ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : filteredFixComplete.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                filteredFixComplete.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {new Date(item.created_at).toLocaleString("th-TH")}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.completed_by || "-"}</td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setShowDetail(true);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition border cursor-pointer"
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

            {showDetail && (
                <DetailModal item={selectedItem} onClose={() => setShowDetail(false)} />
            )}
        </div>
    );
};

export default Complete_Form;
