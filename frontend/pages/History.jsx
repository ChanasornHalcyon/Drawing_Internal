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
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-[#1C70D3] text-white sticky top-0 z-10">
                <tr>
                  {[
                    "Modified At",
                    "Modified By",
                    "Drawing No.",
                    "Customer Name",
                    "Customer Part No.",
                    "Material",
                    "Rev",
                    "Description",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 border border-[#1C70D3]/40 text-left text-[13px] font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {history.map((item) => {
                  const data = parseData(item.data);
                  return (
                    <tr
                      key={item.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-all duration-150"
                    >
                      <td className="px-4 py-2 border whitespace-nowrap text-gray-800">
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

                      <td className="px-4 py-2 border">{data.rev || "-"}</td>

                      <td className="px-4 py-2 border break-words max-w-[200px]">
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
