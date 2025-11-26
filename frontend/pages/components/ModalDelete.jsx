import React from "react";
import { motion } from "framer-motion";

const ModalDeleteFile = ({ onClose, onConfirm, submitting, sendData = {} }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start mt-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
      >
        <div className="bg-white rounded-2xl shadow-xl w-[350px] sm:w-[400px] md:w-[450px] text-center p-6">
          <h5 className="text-2xl font-semibold text-black mb-3">
            Confirm Delete
          </h5>
          <p className="text-gray-700 text-sm mb-6">
            คุณแน่ใจหรือไม่ว่าต้องการลบ History นี้{" "}
            <span className="font-semibold text-red-600">
              {sendData.drawing_no || "นี้"}
            </span>{" "}
            ?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black cursor-pointer transition"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(sendData.id)}
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer transition"
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
    </>
  );
};

export default ModalDeleteFile;
