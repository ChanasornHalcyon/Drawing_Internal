import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarIT from "../components/NavbarIT";
import ModalStartWork from "../components/ModalStartWork";
import ModalProblemForm from "../components/ModalProblemForm";
import ModalCompleteForm from "../components/ModalCompleteForm";

const ApproveFixItFormPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [selectedProblemItem, setSelectedProblemItem] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCompleteItem, setSelectedCompleteItem] = useState(null);

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getApproveFixForm");
      if (res.data.success) {
        setData(
          res.data.data.map((item) => ({
            ...item,
            form_type: "FIX",

          }))

        );
        console.log(res.data.success)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:4000/updateStatus/${id}`, {
      status,
      username: localStorage.getItem("username"),
      form_type: "FIX",
    });
    getData();
  };

  const markProblem = async (id, detail) => {
    try {
      await axios.put(`http://localhost:4000/updateStatus/${id}`, {
        status: "PROBLEM",
        problem_detail: detail,
        username: localStorage.getItem("username"),
        form_type: "FIX",
      });

      getData();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF]">
      <NavbarIT />

      <div className="container mx-auto max-w-[1450px] pt-32">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-start">วันที่ร้องขอ</th>
                <th className="px-4 py-3 text-start">ผู้ร้องขอ</th>
                <th className="px-4 py-3 text-start">แผนก</th>
                <th className="px-4 py-3 text-start">วัตถุประสงค์</th>
                <th className="px-4 py-3 text-start">รายละเอียด</th>
                <th className="px-4 py-3 text-start">อุปกรณ์</th>
                <th className="px-4 py-3 text-start">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2 text-black">
                      {new Date(item.created_at).toLocaleString("th-TH")}
                    </td>
                    <td className="px-4 py-2 text-black">{item.requester}</td>
                    <td className="px-4 py-2 text-black">{item.department}</td>
                    <td className="px-4 py-2 text-black">{item.purpose}</td>
                    <td className="px-4 py-2 text-black">{item.detail}</td>
                    <td className="px-4 py-2 text-black">{item.tools}</td>

                    <td className="px-4 py-2 flex gap-2">
                      {item.status === "APPROVED" && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition  cursor-pointer"
                        >
                          เริ่มงาน
                        </button>
                      )}

                      {item.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => {
                            setSelectedCompleteItem(item);
                            setShowCompleteModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition  cursor-pointer"
                        >
                          เสร็จงาน
                        </button>
                      )}

                      {item.status !== "COMPLETE" && (
                        <button
                          onClick={() => {
                            setSelectedProblemItem(item);
                            setShowProblemModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                        >
                          ติดปัญหา
                        </button>
                      )}

                      {item.status === "COMPLETE" && (
                        <span className="px-3 py-1 text-sm bg-gray-200 rounded-lg">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6">
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalStartWork
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            updateStatus(selectedItem.id, "IN_PROGRESS");
            setShowModal(false);
          }}
        />
      )}

      {showProblemModal && (
        <ModalProblemForm
          item={selectedItem}
          onClose={() => setShowProblemModal(false)}
          onSubmitProblem={(problemText) =>
            markProblem(selectedItem.id, problemText)
          }
        />
      )}

      {showCompleteModal && (
        <ModalCompleteForm
          item={selectedCompleteItem}
          onClose={() => setShowCompleteModal(false)}
          onConfirm={() => {
            updateStatus(selectedCompleteItem.id, "COMPLETE");
            setShowCompleteModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ApproveFixItFormPage;
