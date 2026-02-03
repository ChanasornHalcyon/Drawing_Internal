import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import DetailModal from "../components/DetailModal";

const Complete_Form = () => {
    const [itComplete, setItComplete] = useState([]);
    const [fixComplete, setFixComplete] = useState([]);
    const [loadingIT, setLoadingIT] = useState(true);
    const [loadingFix, setLoadingFix] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const loadITComplete = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getCompleteForm");
            if (res.data.success) {
                setItComplete(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIT(false);
        }
    };

    const loadFixComplete = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getCompleteFixForm");
            if (res.data.success) {
                setFixComplete(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingFix(false);
        }
    };

    const openDetail = (item) => {
        setSelectedItem(item);
        setShowDetail(true);
    };

    useEffect(() => {
        loadITComplete();
        loadFixComplete();
    }, []);

    return (
        <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
            <NavbarIT />

            <div className="container mx-auto max-w-[1450px] pt-32 pb-20">

                <h1 className="text-2xl font-bold mb-5 text-black text-center">
                    รายการร้องขอที่สำเร็จ
                </h1>

                <div className="overflow-x-auto mb-16">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                {/* <th className="px-4 py-3 text-start">วันที่ต้องการ</th> */}
                                {/* <th className="px-4 py-3 text-start">วันที่เสร็จ</th> */}
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
                            ) : itComplete.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center py-6 text-gray-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                itComplete.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                    >
                                        <td className="px-4 py-2">
                                            {new Date(item.created_at).toLocaleString("th-TH")}
                                        </td>
                                        {/* <td className="px-4 py-2">
                                            {item.required_date
                                                ? new Date(item.required_date).toLocaleDateString("th-TH")
                                                : "-"}
                                        </td> */}
                                        {/* <td className="px-4 py-2">
                                            {item.completed_at
                                                ? new Date(item.completed_at).toLocaleString("th-TH")
                                                : "-"}
                                        </td> */}

                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.reason}</td>
                                        <td className="px-4 py-2">{item.completed_by || "-"}</td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => openDetail(item)}
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

                <h1 className="text-2xl font-bold mb-5 text-black text-center">
                    รายการแจ้งซ่อมที่สำเร็จ
                </h1>

                <div className="overflow-x-auto">
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
                            ) : fixComplete.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                fixComplete.map((item) => (
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
                                        <td className="px-4 py-2">{item.completed_by || "-"}   {/* แสดงชื่อ–นามสกุล */}</td>

                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => openDetail(item)}
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
