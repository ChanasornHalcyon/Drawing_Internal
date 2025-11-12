import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import ModalEditFile from "./components/ModalEditFile";

const Data = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getAllData");
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
      alert(" Updated successfully!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Error updating:", err);
      alert(" Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-32">
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
                <th className="px-4 py-2 border">Coolant Hole</th>
                <th className="px-4 py-2 border">Flute</th>
                <th className="px-4 py-2 border">Coating</th>
                <th className="px-4 py-2 border">Shank Material</th>
                <th className="px-4 py-2 border">Shank Shape</th>
                <th className="px-4 py-2 border text-center">Drawing</th>
                <th className="px-4 py-2 border text-center">Action</th>
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
                    <td className="px-4 py-2 border text-black">{item.rev}</td>
                    <td className="px-4 py-2 border text-black">
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
                    </td>

                    <td className="px-4 py-2 border text-center">
                      {item.file_url ? (
                        <a
                          href={`http://localhost:5000${item.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center hover:scale-110 transition-transform"
                        ></a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        className=" cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm border border-blue-200"
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
          initialData={selectedItem}
        />
      )}
    </div>
  );
};

export default Data;
