import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import ModalEditFile from "./components/ModalEditFile";
import ModalDeleteFile from "./components/ModalDelete";
import { FaFilePdf } from "react-icons/fa6";
import { MdHistory } from "react-icons/md";
import { useRouter } from "next/router";
const Data = () => {
  const [data, setData] = useState([]);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      fetchData();
    } catch (err) {
      console.error("Error updating:", err);
      alert(" Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      setSubmitting(true);
      await axios.delete(`http://localhost:4000/deleteDrawing/${id}`);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Delete failed");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    const userRole = localStorage.getItem("role");
    console.log("role from localStorage:", userRole);
    setRole(userRole || "");
    if (storedResults) {
      setData(JSON.parse(storedResults));
    } else {
      fetchData();
    }
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-32">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-900 rounded-xl shadow overflow-hidden">
            <thead className="bg-[#1C70D3] text-white text-left">
              <tr>
                <th className="px-4 py-2 border">Date Drawing</th>
                <th className="px-4 py-2 border">Date Added</th>
                <th className="px-4 py-2 border">Drawing No.</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Customer Part No.</th>
                <th className="px-4 py-2 border">Material</th>
                <th className="px-4 py-2 border">PCD Grade</th>
                {role !== "Engineers" && (
                  <th className="px-4 py-2 border">Sales Price</th>
                )}
                {role !== "Sale" && <th className="px-4 py-2 border">Cost</th>}
                <th className="px-4 py-2 border">Rev</th>
                {/* <th className="px-4 py-2 border">Coolant Hole</th> */}
                {/* <th className="px-4 py-2 border">Flute</th>
                <th className="px-4 py-2 border">Coating</th>
                <th className="px-4 py-2 border">Shank Material</th>
                <th className="px-4 py-2 border">Shank Shape</th> */}
                <th className="px-4 py-2 border text-center">Drawing</th>
                {role === "Engineers" && (
                  <th className="px-4 py-2 border text-center">Action</th>
                )}
                <th className="px-4 py-2 border text-center">History</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2 border text-black text-nowrap">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("sv-SE", {
                            timeZone: "Asia/Bangkok",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border text-black text-nowrap">
                      {item.date_add
                        ? new Date(item.date_add).toLocaleDateString("sv-SE", {
                            timeZone: "Asia/Bangkok",
                          })
                        : "-"}
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
                      {item.material_main}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.pcd_grade}
                    </td>
                    {role !== "Engineers" && (
                      <td className="px-4 py-2 border text-black">
                        {item.price}
                      </td>
                    )}
                    {role !== "Sale" && (
                      <td className="px-4 py-2 border text-black">
                        {item.cost}
                      </td>
                    )}
                    <td className="px-4 py-2 border text-black">{item.rev}</td>
                    {/* <td className="px-4 py-2 border text-black">
                      {item.coolant_hole}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.flute}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.coating}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.shank_material}
                    </td>
                    <td className="px-4 py-2 border text-black">
                      {item.shank_shape}
                    </td> */}

                    <td className="px-4 py-2 border text-center">
                      {item.file_url ? (
                        <a
                          href={`http://localhost:4000${item.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <FaFilePdf className="text-red-600 text-2xl" />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {role === "Engineers" && (
                      <td className="px-4 py-2 border text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="flex justify-center items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 
                               text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 
                                shadow-sm border border-blue-200 cursor-pointer"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5h2m3 0h3m-3 0a2 2 0 012 2v3m-2 8H7a2 2 0 01-2-2V7a2 2 0 012-2h3m6 12l5 5M13 19l5 5"
                              />
                            </svg>
                            <span className="text-sm font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="flex justify-center items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 
                           text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 
                            shadow-sm border border-red-200 cursor-pointer"
                            title="Delete"
                          >
                            {" "}
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-2 border text-black text-center align-middle">
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
                  <td colSpan="15" className="text-center py-4 text-gray-500">
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
      {showDeleteModal && (
        <ModalDeleteFile
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          submitting={submitting}
          sendData={selectedItem}
        />
      )}
    </div>
  );
};

export default Data;
