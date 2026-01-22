import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ModalAddUser from "../components/ModalAddUser";
import ModalResetPassword from "../components/ModalResetPassword";
import ModalDeleteUser from "../components/ModalDeleteUser";
import { useRouter } from "next/router";
import ModalEditUser from "../components/ModalEditUser";
import Searchbar from "../components/Searchbar";
const Users_Management = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setshowEditModal] = useState(false);
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

  const FormForEdit = (item) => {
    setForm({
      id: item.id,
      firstname: item.firstname,
      lastname: item.lastname,
      nickname: item.nickname,
      username: item.username,
      password: "",
      email: item.email,
      department: item.department,
      section: item.section,
      role: item.role,
      level: item.level,
    });
  };
  const goPermissionPage = (item) => {
    console.log(item);
    router.push({
      pathname: "/PermissionPage",
      query: {
        userId: item.id,
        email: item.email,
        username: item.username,
        firstname: item.firstname,
        lastname: item.lastname,
        nickname: item.nickname,
        role: item.role,
        department: item.department,
        session: item.session
      },
    });
  };
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/searchUser?keyword=${search}`
      );
      setData(res.data.users);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (search.trim() === "") {
          await getUser();
        } else {
          await handleSearch();
        }
        const userRole = localStorage.getItem("role");
        setRole(userRole || "");

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [search]);

  return (
    <div className="container mx-auto max-w-[1920px] min-h-screen bg-[#F8F8FF] relative">
      <Navbar />
      <div className="container mx-auto max-w-[1450px] pt-24">
        <div className="flex items-center justify-between mb-14 ">
          <div className="w-1/3" />
          <div className="w-1/3 flex justify-center">
            <Searchbar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username, email..."
            />
          </div>

          <div className="w-1/3 flex justify-end">
            <button
              onClick={() => {
                setForm({
                  id: "",
                  firstname: "",
                  lastname: "",
                  nickname: "",
                  username: "",
                  password: "",
                  email: "",
                  department: "",
                  section: "",
                  role: "User",
                  level: "1",
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

        </div>


        <div className="overflow-x-auto sm:px-2 md:px-4 lg:px-0">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-br from-[#1C70D3] to-[#155BB5] text-white shadow">
              <tr>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Username
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Email
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Firstname
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Lastname
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Nickname
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Role
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Department
                </th>
                <th className="px-4 py-3 border-r border-blue-300/30 text-nowrap font-semibold tracking-wide text-left">
                  Section
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
                  <td className="px-4 py-2 text-nowrap font-semibold  text-black">
                    {item.username}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold  text-blue-600">
                    {item.email}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold  text-black">
                    {item.firstname}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold  text-black">
                    {item.lastname}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold  text-black">
                    {item.nickname}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold text-blue-600">
                    {item.role}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold text-blue-600">
                    {item.department}
                  </td>
                  <td className="px-4 py-2 text-nowrap font-semibold text-blue-600">
                    {item.section}
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
                        className="cursor-pointer px-3 py-1 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition shadow-sm border border-orange-200"
                      >
                        Permission
                      </button>
                      <button
                        onClick={() => {
                          FormForEdit(item);
                          setshowEditModal(true);
                        }}
                        className="cursor-pointer px-3 py-1 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white transition shadow-sm border border-purple-200"
                      >
                        Edit
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

        {showEditModal && (
          <ModalEditUser
            onClose={() => setshowEditModal(false)}
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
