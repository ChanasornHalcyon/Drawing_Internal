import React from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ModalAddUser = ({
  onClose,
  submitting,
  setSubmitting,
  refreshData,
  form,
  setForm,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitClick = async () => {
    setSubmitting(true);

    try {
      const res = await axios.post("http://localhost:4000/adduser", form);

      if (res.data.success) {
        alert("User added successfully");
        refreshData?.();
        onClose();
      } else {
        alert(res.data.message || "Error");
      }
    } catch (err) {
      console.error(err);
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
        <div className="bg-white rounded-2xl shadow-xl w-[360px] sm:w-[420px] md:w-[520px] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
            <h5 className="text-2xl font-semibold text-black">Add User</h5>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">-- Select Role --</option>
                <option value="Admin">Admin</option>
                <option value="Engineer">Engineer</option>
                <option value="Sale">Sale</option>
                <option value="Management">Management</option>
              </select>
            </div>
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
              onClick={handleSubmitClick}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white transition cursor-pointer"
            >
              {submitting ? "Saving..." : "Submit"}
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

export default ModalAddUser;
