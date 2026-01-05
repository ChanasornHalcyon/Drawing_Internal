import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Problem_Form = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getData = async () => {
        try {
            const res = await axios.get("http://localhost:4000/getProblemForm");
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
            <Navbar />

            <div className="container mx-auto max-w-[1450px] pt-32">
                <h1 className="text-2xl font-bold text-red-600 mb-6 text-center">รายการที่มีปัญหา</h1>

                <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                                <th className="px-4 py-3 text-start">ปัญหา</th>
                                <th className="px-4 py-3 text-start">แจ้งโดย</th>
                                <th className="px-4 py-3 text-start">เวลาแจ้งปัญหา</th>

                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="odd:bg-white even:bg-gray-50 hover:bg-red-50 transition"
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

                                        <td className="px-4 py-2">{item.requester}</td>
                                        <td className="px-4 py-2">{item.purpose}</td>
                                        <td className="px-4 py-2 text-red-600 font-medium">
                                            {item.problem_detail || "-"}
                                        </td>

                                        <td className="px-4 py-2">
                                            {item.problem_by || "-"}
                                        </td>

                                        <td className="px-4 py-2">
                                            {item.problem_at
                                                ? new Date(item.problem_at).toLocaleString("th-TH", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: false,
                                                })
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        ไม่มีรายการที่มีปัญหา
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Problem_Form;