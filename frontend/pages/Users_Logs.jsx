import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaFilePdf } from "react-icons/fa6";

const Users_Logs = () => {
  const [logs, setLogs] = useState([]);

  const getDataLogs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getDrawingLogs");
      if (res.data.success) setLogs(res.data.data);
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  useEffect(() => {
    getDataLogs();
  }, []);

  // สี hover ของแต่ละแถว
  const getRowColor = (type) => {
    switch (type) {
      case "ADD":
        return "hover:bg-green-100";
      case "EDIT":
        return "hover:bg-blue-100";
      case "DELETE":
        return "hover:bg-red-100";
      default:
        return "";
    }
  };

  const colorType = (type) => {
    if (type === "ADD") return <span className="text-green-700">ADD</span>;
    if (type === "EDIT") return <span className="text-blue-700">EDIT</span>;
    if (type === "DELETE") return <span className="text-red-700">DELETE</span>;
    return type;
  };

  const parseDetail = (raw) => {
    if (!raw) return {};

    let detail = {};

    try {
      detail = JSON.parse(raw);

      if (detail.data_before_delete) {
        detail = detail.data_before_delete;
      }
    } catch {
      return {};
    }

    return detail;
  };

  const show = (v) => (v && v !== "" ? v : "-");

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />

      <div className="container mx-auto max-w-[1450px] pt-32 pb-10">
        <h2 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
          User Logs
        </h2>

        <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-linear-to-br from-[#1C70D3] to-[#155BB5] text-white shadow">
              <tr>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Created At
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Action Type
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Action By
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  CustomerName
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Drawing_No
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">Rev</th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  CustomerPart
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Description
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">
                  Material
                </th>
                <th className="px-4 py-3 font-semibold text-nowrap">Coolant</th>
                <th className="px-4 py-3 font-semibold text-nowrap">Flute</th>
                <th className="px-4 py-3 font-semibold text-nowrap">Type</th>
                <th className="px-4 py-3 font-semibold text-nowrap">File</th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => {
                  const detail = parseDetail(log.action_detail);

                  return (
                    <tr
                      key={log.id}
                      className={`odd:bg-white even:bg-gray-50 border-b border-gray-200 transition-all duration-150 ${getRowColor(
                        log.action_type
                      )}`}
                    >
                      <td className="px-4 py-2 text-nowrap">
                        {new Date(log.created_at).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Bangkok",
                        })}
                      </td>

                      <td className="px-4 py-2 font-semibold">
                        {colorType(log.action_type)}
                      </td>

                      <td className="px-4 py-2">{log.action_by}</td>

                      <td className="px-4 py-2">{show(detail.customerName)}</td>
                      <td className="px-4 py-2">{show(detail.drawingNo)}</td>
                      <td className="px-4 py-2">{show(detail.rev)}</td>
                      <td className="px-4 py-2">{show(detail.customerPart)}</td>
                      <td className="px-4 py-2">{show(detail.description)}</td>
                      <td className="px-4 py-2">{show(detail.materialMain)}</td>
                      <td className="px-4 py-2">{show(detail.CoolantHole)}</td>
                      <td className="px-4 py-2">{show(detail.Flute)}</td>
                      <td className="px-4 py-2">{show(detail.type)}</td>

                      <td className="px-4 py-2 text-center">
                        {detail.file_url ? (
                          <a
                            href={`http://localhost:4000${detail.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <FaFilePdf className="text-red-600 text-2xl drop-shadow-sm" />
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="15"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No Logs Found.
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

export default Users_Logs;
