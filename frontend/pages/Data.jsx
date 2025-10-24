import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { FaFilePdf } from "react-icons/fa6";

const Data = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getAllData");
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-6xl mt-10">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-900 rounded-xl shadow overflow-hidden">
            <thead className="bg-[#1C70D3] text-white text-left">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Drawing No.</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Customer Part No.</th>
                <th className="px-4 py-2 border">Material</th>
                <th className="px-4 py-2 border">PCD Grade</th>
                <th className="px-4 py-2 border">Rev</th>
                <th className="px-4 py-2 border text-center">Drawing</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2 border text-black">
                      {item.date ? item.date.split("T")[0] : "-"}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.drawing_no}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.description}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.customer_name}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.customer_part_no}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.material_main} , {item.material_sub}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.pcd_grade}
                    </td>
                    <td className="px-4 py-2 border text-black">{item.rev}</td>

                    <td className="px-4 py-2 border text-center">
                      {item.file_url ? (
                        <a
                          href={`http://localhost:4000${item.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                          title="View PDF"
                        >
                          <FaFilePdf className="text-red-600 text-2xl" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    ไม่มีข้อมูลในระบบ
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

export default Data;
