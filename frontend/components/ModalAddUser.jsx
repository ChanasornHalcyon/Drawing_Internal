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

  const handleSubmitClick = async (e) => {
    e.preventDefault();
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

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-300 text-black bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-blue-400  transition ";

  const inputClassRequired = inputClass + " border-l-4 border-l-red-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex justify-center items-start pt-12"
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -32 }}
        transition={{ duration: 0.25 }}
      >
        <form onSubmit={handleSubmitClick}>
          <div className="bg-white rounded-3xl shadow-2xl w-[380px] sm:w-[440px] md:w-[500px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h5 className="text-xl font-semibold text-gray-900">
                Add New User
              </h5>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-4xl leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname || ""}
                    onChange={handleChange}
                    className={inputClassRequired}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname || ""}
                    onChange={handleChange}
                    className={inputClassRequired}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Nickname</label>
                <input
                  type="text"
                  name="nickname"
                  value={form.nickname || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className={inputClassRequired}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  className={inputClassRequired}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className={inputClass}

                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Department</label>
                  <select
                    name="department"
                    value={form.department || ""}
                    onChange={handleChange}
                    className={inputClassRequired}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Section</label>
                  <select
                    name="section"
                    value={form.section || ""}
                    onChange={handleChange}
                    className={inputClass}

                  >
                    <option value="">Select Section</option>
                    <option value="IT">IT</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Role</label>
                  <select
                    name="role"
                    value={form.role || ""}
                    onChange={handleChange}
                    className={inputClassRequired}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level</label>
                  <select
                    name="level"
                    value={form.level || ""}
                    onChange={handleChange}
                    className={inputClassRequired}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold cursor-pointer"
              >
                {submitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
    </>
  );
};

export default ModalAddUser;
