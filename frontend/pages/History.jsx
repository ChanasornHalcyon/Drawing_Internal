import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "./components/Navbar";

const History = () => {
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:4000/getDrawingHistory/${id}`)
        .then((res) => setHistory(res.data.data || []))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const parseData = (data) => {
    try {
      if (typeof data === "string" && /^[{\[]/.test(data.trim())) {
        return JSON.parse(data);
      } else if (typeof data === "object") {
        return data;
      } else return {};
    } catch (err) {
      return {};
    }
  };

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-32">
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center text-[#1C70D3]">
            History of Drawing
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-500 text-center">No history found.</p>
          ) : (
            <table className="min-w-full text-sm text-gray-700 border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-[#1C70D3] text-white">
                <tr>
                  <th className="px-4 py-2 border text-left">Modified At</th>
                  <th className="px-4 py-2 border text-left">Modified By</th>
                  <th className="px-4 py-2 border text-left">Drawing No.</th>
                  <th className="px-4 py-2 border text-left">Customer Name</th>
                  <th className="px-4 py-2 border text-left">
                    Customer Part No.
                  </th>
                  <th className="px-4 py-2 border text-left">Material</th>
                  <th className="px-4 py-2 border text-left">PCD Grade</th>
                  <th className="px-4 py-2 borde text-left">Rev</th>
                  <th className="px-4 py-2 border text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => {
                  const data = parseData(item.data);
                  return (
                    <tr
                      key={item.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                    >
                      <td className="px-4 py-2 border text-nowrap">
                        {new Date(item.modified_at).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Bangkok",
                        })}
                      </td>
                      <td className="px-4 py-2 border">{item.modified_by}</td>
                      <td className="px-4 py-2 border">
                        {data.drawing_no || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {data.customer_name || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {data.customer_part_no || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {data.material_main || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {data.pcd_grade || "-"}
                      </td>
                      <td className="px-4 py-2 border">{data.rev || "-"}</td>
                      <td className="px-4 py-2 border">
                        {data.description || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
