import React from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ModalDeleteUser = ({
  onClose,
  submitting,
  setSubmitting,
  refreshData,
  form,
}) => {
  const handleDelete = async () => {
    if (!form.id) return;

    setSubmitting(true);

    try {
      const res = await axios.delete(
        `/api/deleteUser/${form.id}`
      );
      if (res.data.success) {
        refreshData?.();
        onClose();
      } else {
      }
    } catch (err) {
      console.error("Delete user error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start mt-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-[360px] sm:w-[420px] md:w-[460px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h5 className="text-2xl font-semibold text-black">Delete User</h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-5 text-center text-gray-700 text-base">
            คุณต้องการลบ User{" "}
            <span className="font-semibold text-black">{form?.username}</span>{" "}
            ใช่หรือไม่?
          </div>

          <div className="flex justify-end gap-2 p-4 border-t bg-white sticky bottom-0">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-gray-200 text-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition cursor-pointer"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        animate={{ opacity: 0.5 }}
        onClick={onClose}
      />
    </>
  );
};

export default ModalDeleteUser;
