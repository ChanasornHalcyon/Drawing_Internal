import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import axios from "axios";
import { motion } from "framer-motion";

const NPTA = () => {
  const [dataNPTA, setDataNPTA] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchDataNPTA = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getNPTA");
      if (res.data.success) {
        setDataNPTA(res.data.data);
      } else {
        console.warn(" ไม่พบข้อมูล NPTA");
      }
    } catch (err) {
      console.error(" Error fetching data:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบข้อมูลนี้ใช่หรือไม่?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/delete/${id}`);
      if (res.data.success) {
        setDataNPTA((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (err) {
      console.error(" Delete error:", err);
    }
  };

  useEffect(() => {
    fetchDataNPTA();
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] h-dvh bg-[#F8F8FF] relative">
      <Navbar />
      <Searchbar fetchDataNPTA={fetchDataNPTA} />

      <div className="w-full mt-10 px-5">
        <h2 className="text-2xl font-semibold mb-6 text-[#0B4EA2] text-center">
          Customer: NPTA
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-900 rounded-xl shadow overflow-hidden">
            <thead className="bg-[#1C70D3] text-white text-left">
              <tr>
                <th className="px-4 py-3 border-r border-gray-900">Id</th>
                <th className="px-4 py-3 border-r border-gray-900">Reason</th>
                <th className="px-4 py-3 border-r border-gray-900">
                  Description
                </th>
                <th className="px-4 py-3 border-r border-gray-900">Material</th>
                <th className="px-4 py-3 border-r border-gray-900">
                  Customer Part
                </th>
                <th className="px-4 py-3 border-r border-gray-900">DWG No.</th>
                <th className="px-4 py-3 border-r border-gray-900">
                  Customer Name
                </th>
                <th className="px-4 py-3 border-r border-gray-900 text-center">
                  Image
                </th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="bg-[#F5F5F5]">
              {dataNPTA.map((item, index) => (
                <tr key={index} className="border border-gray-900">
                  <td className="px-4 py-3 text-center border-r border-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.reason}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.material}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.customer_part}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.dwg_no}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-700">
                    {item.customer_name}
                  </td>

                  <td className="px-4 py-3 border-r border-gray-700 text-center">
                    {item.image_url ? (
                      item.image_url.toLowerCase().endsWith(".pdf") ? (
                        <a
                          href={`http://localhost:4000${item.image_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600  hover:text-blue-800"
                        >
                          View PDF
                        </a>
                      ) : (
                        <div className="flex justify-center items-center">
                          <img
                            src={`http://localhost:4000${item.image_url}`}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setPreviewImage(item.image_url)}
                          />
                        </div>
                      )
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-md font-medium rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewImage && (
        <>
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#F8F8FF] rounded-2xl shadow-2xl p-3 relative max-w-[90%] max-h-[90%] flex flex-col items-center">
              <div className="w-full flex justify-end mb-2">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-600 hover:text-red-500 text-2xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <img
                src={`http://localhost:4000${previewImage}`}
                alt="Full Preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-md"
              />
            </div>
          </motion.div>

          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          />
        </>
      )}
    </div>
  );
};

export default NPTA;
