import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { RiLockPasswordFill } from "react-icons/ri";
import ModalResetPassword from "./ModalResetPassword";

const Navbar = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [form, setForm] = useState({
    id: "",
    password: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("role");
    localStorage.removeItem("department");
    localStorage.removeItem("userId");

    router.push("/");
  };

  const goHomePage = () => {
    router.push("/homepage");
  };

  useEffect(() => {
    const fname = localStorage.getItem("fname");
    const lname = localStorage.getItem("lname");
    const uid = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role");

    setRole(userRole || "");


    if (fname || lname) {
      setDisplayName(`${fname || ""} ${lname || ""}`.trim());
    }

    if (uid) {
      setForm((prev) => ({ ...prev, id: uid }));
    }
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50
        bg-[#F0F8FF] backdrop-blur-xl
        shadow-[0_12px_35px_rgba(11,78,162,0.25)]
        px-6 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-3 ml-5">
          <img
            onClick={goHomePage}
            className="w-11 cursor-pointer hover:scale-105 transition"
            src="ht-logo.png"
            alt="HT"
          />
        </div>

        {displayName && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl
              hover:bg-blue-100/60 transition cursor-pointer"
            >
              <FaUserCircle className="text-2xl text-[#0B4EA2]" />
              <span className="text-[#0B4EA2] font-medium text-base cursor-pointer">
                {displayName}
              </span>
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-44
                bg-white/90 backdrop-blur-lg rounded-2xl
                shadow-[0_20px_40px_rgba(30,64,175,0.25)]
                border border-blue-200/60 overflow-hidden"
              >
                {role !== "Admin" && (
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="w-full px-4 py-3 text-sm text-gray-700
                    hover:bg-blue-50 hover:text-blue-600
                    transition flex items-center gap-2 cursor-pointer"
                  >
                    <RiLockPasswordFill className="text-base" />
                    เปลี่ยนรหัสผ่าน
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm text-gray-700
                  hover:bg-red-50 hover:text-red-600
                  transition flex items-center gap-2 cursor-pointer"
                >
                  <FiLogOut className="text-base" />
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {showResetModal && (
        <ModalResetPassword
          onClose={() => setShowResetModal(false)}
          submitting={false}
          setSubmitting={() => { }}
          refreshData={() => { }}
          form={form}
          setForm={setForm}
        />
      )}
    </>
  );
};

export default Navbar;
