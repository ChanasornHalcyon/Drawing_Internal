import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import DetailModal from "../components/DetailModal";

const Complete_Form = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getCompleteForm");
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
                                <th className="px-4 py-3 text-start">วันที่เสร็จ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">แผนก</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">รายละเอียด</th>
                                <th className="px-4 py-3 text-start">เหตุผล</th>
                                <th className="px-4 py-3 text-start">Complete By</th>
                                <th className="px-4 py-3 ">Action</th>
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
                                        <td className="px-4 py-2">
                                            {item.completed_at
                                                ? new Date(item.completed_at).toLocaleString("th-TH", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.department}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2">{item.detail}</td>
                                        <td className="px-4 py-2">{item.reason}</td>
                                        <td className="px-4 py-2 items-center">
                                            {item.completed_by || "-"}
                                        </td>
                                        <td className="px-4 py-2 flex justify-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedItem(item);
                                                    setShowDetail(true);
                                                }}
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
            {showDetail && (
                <DetailModal item={selectedItem} onClose={() => setShowDetail(false)} />
            )}
        </div>

    );
};

export default Complete_Form;