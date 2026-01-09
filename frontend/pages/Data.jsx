import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarDrawing from "../components/NavbarDrawing";
import ModalEditFile from "../components/ModalEditFile";
import { FaFilePdf } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { useRouter } from "next/router";
const Data = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState("");
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getAllData");
      console.log(res);
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSubmitEdit = async (form, id) => {
    try {
      setSubmitting(true);
      await axios.put(`http://localhost:4000/updateDrawing/${id}`, form);
      setShowModal(false);

      const filters = localStorage.getItem("searchFilters");
      if (filters) {
        getFilter(JSON.parse(filters));
      } else {
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getFilter = async (filters) => {
    const res = await axios.post(
      "http://localhost:4000/searchDrawing",
      filters
    );
    setData(res.data.data || []);
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");

    const filters = localStorage.getItem("searchFilters");
    if (filters) {
      getFilter(JSON.parse(filters));
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <NavbarDrawing />
      <div className="container mx-auto max-w-[1450px] pt-32">
        <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden  ">
            <thead className="bg-linear-to-br from-[#1C70D3] to-[#155BB5] text-white shadow">
              <tr>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Date Drawing
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Date Added
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Drawing No.
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Description
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Customer
                </th>

                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Material
                </th>

                {role !== "Engineers" && (
                  <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                    Sales Price
                  </th>
                )}
                {role !== "Sale" && (
                  <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                    Cost
                  </th>
                )}

                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Rev
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Coolant
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Flute
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide">
                  Coating
                </th>

                <th className="px-4 py-3 border-r border-blue-300/30 text-center font-semibold tracking-wide">
                  Drawing
                </th>

                {role === "Engineers" && (
                  <th className="px-4 py-3 border-r border-blue-300/30 text-center font-semibold tracking-wide">
                    Action
                  </th>
                )}

                <th className="px-4 py-3 text-center font-semibold tracking-wide">
                  History
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/60 transition-all duration-150 border-b border-gray-200"
                  >
                    <td className="px-4 py-2 text-gray-800 text-nowrap">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("sv-SE", {
                          timeZone: "Asia/Bangkok",
                        })
                        : "-"}
                    </td>

                    <td className="px-4 py-2 text-gray-800 text-nowrap">
                      {item.date_add
                        ? new Date(item.date_add).toLocaleDateString("sv-SE", {
                          timeZone: "Asia/Bangkok",
                        })
                        : "-"}
                    </td>

                    <td className="px-4 py-2">{item.drawing_no}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.customer_name}</td>

                    <td className="px-4 py-2">{item.material_main}</td>

                    {role !== "Engineers" && (
                      <td className="px-4 py-2">{item.price}</td>
                    )}
                    {role !== "Sale" && (
                      <td className="px-4 py-2">{item.cost}</td>
                    )}

                    <td className="px-4 py-2">{item.rev}</td>
                    <td className="px-4 py-2">{item.coolant_hole}</td>
                    <td className="px-4 py-2">{item.flute}</td>
                    <td className="px-4 py-2">{item.coating}</td>

                    <td className="px-4 py-2 text-center">
                      {item.file_url ? (
                        <a
                          href={`http://localhost:4000${item.file_url}`}
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
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className=" cursor-pointer px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-200"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-2 text-center">
                      <MdHistory
                        className="mx-auto text-blue-500 hover:text-blue-700 cursor-pointer"
                        size={30}
                        title="View History"
                        onClick={() => {
                          router.push(`/History?id=${item.id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="text-center py-6 text-gray-500">
                    ไม่มีข้อมูลในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalEditFile
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitEdit}
          submitting={submitting}
          sendData={selectedItem}
        />
      )}
    </div>
  );
};

export default Data;
