import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import { useRouter } from "next/router";
import ModalDeleteFile from "./components/ModalDelete";
import { FaFilePdf } from "react-icons/fa6";

const History = () => {
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
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
      }
      return {};
    } catch {
      return {};
    }
  };
  const handleDelete = async (deleteId) => {
    try {
      await axios.delete(
        `http://localhost:4000/deleteDrawingHistory/${deleteId}`
      );
      setShowDelete(false);
      setSelected(null);
      setHistory(history.filter((h) => h.id !== deleteId));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-32 pb-10">
        <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
          <h2 className="text-3xl font-bold text-[#1C70D3] text-center mb-10">
            History of Drawing
          </h2>
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-linear-to-br from-[#1C70D3] to-[#155BB5] text-white">
              <tr>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Modified At
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Modified By
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Drawing No.
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Description
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Customer
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Material
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Cost
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Rev
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 font-semibold text-nowrap tracking-wide text-left">
                  Coolant
                </th>
                <th className="px-4 py-3 border-r font-semibold  border-blue-300/30 text-nowrap tracking-wide text-left">
                  Flute
                </th>
                <th className="px-4 py-3 border-r font-semibold  border-blue-300/30 text-nowrap tracking-wide text-left">
                  Coating
                </th>
                <th className="px-4 py-3 border-r font-semibold border-blue-300/30 text-nowrap  tracking-wide text-left">
                  Drawing
                </th>
                {role === "Engineers" && (
                  <th className="px-4 py-3 border-r font-semibold border-blue-300/30 text-left">
                    Action
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {history.length > 0 ? (
                history.map((item) => {
                  const d = parseData(item.data);
                  return (
                    <tr
                      key={item.id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/60 transition-all duration-150 border-b border-gray-200"
                    >
                      <td className="px-4 py-2 text-gray-800 text-nowrap">
                        {new Date(item.modified_at).toLocaleString("th-TH", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Bangkok",
                        })}
                      </td>

                      <td className="px-4 py-2">{item.modified_by}</td>

                      <td className="px-4 py-2">{d.drawing_no || "-"}</td>
                      <td className="px-4 py-2  max-w-[250px]">
                        {d.description || "-"}
                      </td>
                      <td className="px-4 py-2">{d.customer_name || "-"}</td>
                      <td className="px-4 py-2">{d.material_main || "-"}</td>
                      <td className="px-4 py-2">{d.cost || "-"}</td>
                      <td className="px-4 py-2">{d.rev || "-"}</td>
                      <td className="px-4 py-2">{d.coolant_hole || "-"}</td>
                      <td className="px-4 py-2">{d.flute || "-"}</td>
                      <td className="px-4 py-2">{d.coating || "-"}</td>
                      <td className="px-4 py-2 text-center">
                        {d.file_url ? (
                          <a
                            href={`http://localhost:4000${d.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                          >
                            <FaFilePdf className="text-red-600 text-2xl drop-shadow-sm" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      {role === "Engineers" && (
                        <td className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSelected(item);
                              setShowDelete(true);
                            }}
                            className="cursor-pointer px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm border border-red-200"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showDelete && (
        <ModalDeleteFile
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
          submitting={false}
          sendData={selected}
        />
      )}
    </div>
  );
};

export default History;
