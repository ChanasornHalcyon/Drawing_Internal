import React, { useState, useEffect } from "react";
import NavbarIT from "../components/NavbarIT";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const Report = () => {
    // เปลี่ยน default เป็น COMPLETE
    const [status, setStatus] = useState("COMPLETE");
    const [chartType, setChartType] = useState("bar");
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const isDateSelected = startDate && endDate;

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("th-TH");
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:4000/ITDashboard", {
                params: { status, startDate, endDate },
            });
            setChartData(res.data.data || []);
        } catch (err) {
            console.error("Dashboard Fetch ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDateSelected) {
            fetchData();
        }
    }, [status, startDate, endDate]);

    const labelText = status === "COMPLETE" ? "Complete" : "Problem";
    const color = status === "COMPLETE" ? "#3b82f6" : "#FF3366";
    const borderColor = status === "COMPLETE" ? "#2563eb" : "#FF3366";

    const data = {
        labels: chartData.map((d) => formatDate(d.date)),
        datasets: [
            {
                label: labelText,
                data: chartData.map((d) => d.total),
                backgroundColor: color,
                borderColor: borderColor,
                tension: 0.35,
                fill: chartType === "bar",
                borderRadius: 8,
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: { color: "#555", font: { size: 12 } },
                grid: { color: "#eee" },
            },
            y: {
                ticks: { color: "#555", font: { size: 12 } },
                grid: { color: "#f3f3f3" },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mx-auto max-w-[1600px] min-h-screen bg-[#F8F8FF]">
            <NavbarIT />

            <div className="pt-24 flex justify-center px-4">
                <div className="w-full max-w-4xl space-y-6">

                    {/* ปุ่มเลือกสถานะ */}
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setStatus("COMPLETE")}
                            className={`px-8 h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer  
                                ${status === "COMPLETE"
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
                                }`}
                        >
                            Complete
                        </button>

                        <button
                            onClick={() => setStatus("PROBLEM")}
                            className={`px-8 h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer  
                                ${status === "PROBLEM"
                                    ? "bg-[#FF3366] text-white shadow-md"
                                    : "bg-white text-[#FF3366] border border-[#FF3366]/40 hover:bg-[#FF3366]/5"
                                }`}
                        >
                            Problem
                        </button>
                    </div>

                    {/* Filter + Chart Type */}
                    <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-2 items-center text-sm">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded-md px-2 py-1 text-sm text-black"
                            />
                            <span className="text-gray-400">–</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded-md px-2 py-1 text-sm text-black"
                            />
                        </div>

                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setChartType("bar")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer
                                    ${chartType === "bar"
                                        ? "bg-white text-blue-600 shadow"
                                        : "text-gray-500 hover:text-blue-600"
                                    }`}
                            >
                                Bar
                            </button>

                            <button
                                onClick={() => setChartType("line")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer
                                    ${chartType === "line"
                                        ? "bg-white text-blue-600 shadow"
                                        : "text-gray-500 hover:text-blue-600"
                                    }`}
                            >
                                Line
                            </button>
                        </div>
                    </div>

                    {/* กราฟ */}
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex justify-center items-center gap-2 mb-4">
                            <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            ></span>
                            <span className="text-gray-700 font-medium">{labelText}</span>
                        </div>

                        {!isDateSelected ? (
                            <div className="text-center text-gray-400 py-16 text-sm">
                                กรุณาเลือกช่วงวันที่เพื่อแสดงกราฟ
                            </div>
                        ) : loading ? (
                            <div className="text-center text-gray-500 py-16 text-sm">
                                กำลังโหลดข้อมูล...
                            </div>
                        ) : chartType === "bar" ? (
                            <div className="h-[400px]">
                                <Bar data={data} options={options} />
                            </div>
                        ) : (
                            <div className="h-[400px]">
                                <Line data={data} options={options} />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Report;
