import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ModalAddUser from "../components/ModalAddUser";
import ModalResetPassword from "../components/ModalResetPassword";
import ModalDeleteUser from "../components/ModalDeleteUser";
import { useRouter } from "next/router";
const Users_Management = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    id: "",
    nickname: "",
    username: "",
    password: "",
    role: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:4000/getUser");
      setData(res.data.users);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    }
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const goPermissionPage = (item) => {
    router.push({
      pathname: "/PermissionPage",
      query: {
        username: item.username,
        nickname: item.nickname,
        role: item.role,
      },
    });
  };


  useEffect(() => {
    getUser();
    const userRole = localStorage.getItem("role");
    setRole(userRole || "");
  }, []);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-24">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setForm({
                id: "",
                nickname: "",
                username: "",
                password: "",
                role: "",
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 
             text-white text-sm font-semibold rounded-full shadow-md cursor-pointer 
             hover:bg-pink-600 hover:shadow-lg transition duration-200"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-br from-[#1C70D3] to-[#155BB5] text-white shadow">
              <tr>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Nickname
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Firstname
                </th>
                 <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Lastname
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Username
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Role
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Password
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50/60 transition-all duration-150 border-b border-gray-200"
                >
                  <td className="px-4 py-2 text-nowrap font-semibold">
                    {item.nickname }
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold">
                    {item.firstname }
                  </td>
                   <td className="px-4 py-2 text-nowrap font-semibold">
                    {item.lastname }
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold">
                    {item.username}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold text-blue-600">
                    {item.role}
                  </td>
                  <td className="px-4 py-2 text-nowrap">
                    <button
                      onClick={() => {
                        setForm({ id: item.id, password: "" });
                        setShowResetModal(true);
                      }}
                      className="cursor-pointer px-3 py-1 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm border border-blue-200"
                    >
                      Reset Password
                    </button>
                  </td>
                  <td className="px-4 py-2 text-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => goPermissionPage(item)}
                        className="cursor-pointer px-3 py-1 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition shadow-sm border border-red-200"
                      >
                        Permission
                      </button>

                      <button
                        onClick={() => handleOpenDelete(item)}
                        className="cursor-pointer px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm border border-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <ModalAddUser
            onClose={() => setShowModal(false)}
            submitting={submitting}
            setSubmitting={setSubmitting}
            refreshData={getUser}
            form={form}
            setForm={setForm}
          />
        )}

        {showResetModal && (
          <ModalResetPassword
            onClose={() => setShowResetModal(false)}
            submitting={submitting}
            setSubmitting={setSubmitting}
            refreshData={getUser}
            form={form}
            setForm={setForm}
          />
        )}
        {showDeleteModal && (
          <ModalDeleteUser
            onClose={() => setShowDeleteModal(false)}
            submitting={submitting}
            setSubmitting={setSubmitting}
            refreshData={getUser}
            form={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default Users_Management;
