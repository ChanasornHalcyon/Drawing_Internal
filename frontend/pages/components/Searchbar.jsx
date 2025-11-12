import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/router";
import ModalAddFile from "./ModalEditFile";
import axios from "axios";

const Searchbar = ({ fetchDataNPTR, fetchDataNPTA }) => {
  const router = useRouter();
  const isHomepage = router.pathname === "/Homepage";
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("reason", formData.reason);
      data.append("description", formData.description);
      data.append("material", formData.material);
      data.append("customer_part", formData.customerPart);
      data.append("dwg_no", formData.dwgNo);
      data.append("customer_name", formData.customerName);
      if (formData.file) data.append("file", formData.file);

      const res = await axios.post("http://localhost:4000/pushData", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(" บันทึกข้อมูลสำเร็จ!");
        setOpenModal(false);
        fetchDataNPTR?.();
        fetchDataNPTA?.();
      } else {
        alert(" ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      console.error(" Error submitting data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center w-full px-5 mt-10 relative">
      <div className="flex justify-center w-full">
        <div className="relative w-[210px] px-2 md:w-[400px] lg:w-[500px]">
          <input
            className="w-full px-4 py-3 pr-10 border border-gray-500 rounded-md text-gray-600 
                       focus:outline-none focus:border-[#FF3399]"
            placeholder="code or description...."
          />
          <CiSearch
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3698FC] 
                       w-8 h-8 cursor-pointer hover:text-blue-600 transition"
          />
        </div>
      </div>

      {!isHomepage && (
        <button
          onClick={() => setOpenModal(true)}
          className="absolute right-3 bg-[#3698FC] text-white border border-black 
                     px-3 py-3 shadow-md rounded-xl hover:bg-blue-500 transition cursor-pointer"
        >
          Add File
        </button>
      )}

      {openModal && (
        <ModalAddFile
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default Searchbar;
