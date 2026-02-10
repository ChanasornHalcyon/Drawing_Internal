import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const IOSToggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
        />
        <div
            className="
        w-11 h-6 bg-gray-300 rounded-full transition-colors
        peer-checked:bg-blue-600
        after:content-[''] after:absolute after:top-0.5 after:left-[2px]
        after:w-5 after:h-5 after:bg-white after:rounded-full
        after:transition-transform peer-checked:after:translate-x-full
      "
        />
    </label>
);

const PermissionItem = ({ title, checked, onChange }) => (
    <div className="flex items-center justify-between px-5 py-5 rounded-2xl border border-gray-200 bg-gray-50">
        <p className="text-lg font-semibold text-gray-800">{title}</p>
        <IOSToggle checked={checked} onChange={onChange} />
    </div>
);

const PermissionSection = ({ title, items, permissions, setPermissions }) => {
    const modulePerm = permissions[title];

    const toggleModule = () => {
        setPermissions((prev) => {
            const isEnabled = prev[title].enabled;
            const next = !isEnabled;

            if (!next) {
                const updated = { enabled: false };
                for (const key in prev[title]) {
                    if (key !== "enabled") updated[key] = false;
                }
                return { ...prev, [title]: updated };
            }

            return {
                ...prev,
                [title]: {
                    ...prev[title],
                    enabled: true,
                },
            };
        });
    };

    const toggleItem = (item) => {
        setPermissions((prev) => ({
            ...prev,
            [title]: {
                ...prev[title],
                [item]: !prev[title][item],
            },
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>

                <IOSToggle checked={modulePerm.enabled} onChange={toggleModule} />
            </div>

            <div
                className={`space-y-4 ${!modulePerm.enabled ? "opacity-40 pointer-events-none" : ""
                    }`}
            >
                {items.map((item) => (
                    <PermissionItem
                        key={item}
                        title={item}
                        checked={modulePerm[item]}
                        onChange={() => toggleItem(item)}
                    />
                ))}
            </div>
        </div>
    );
};


const UserInfo = ({
    email,
    firstname,
    lastname,
    username,
    role,
    department,
    session,
}) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Username</p>
                <p className="text-lg font-semibold text-black">{username || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Email</p>
                <p className="text-lg font-semibold text-black">{email || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Firstname</p>
                <p className="text-lg font-semibold text-black">{firstname || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Lastname</p>
                <p className="text-lg font-semibold text-black">{lastname || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Department</p>
                <p className="text-lg font-semibold text-black">{department || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Session</p>
                <p className="text-lg font-semibold text-black">{session || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Role</p>
                <span className="mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {role || "-"}
                </span>
            </div>
        </div>
    </div>
);

const PermissionPage = () => {
    const router = useRouter();
    const { email, firstname, lastname, username, role, department, session } =
        router.query;

    const [permissions, setPermissions] = useState({
        IT: {
            enabled: false,
            "ฟอร์มร้องขอ": false,
            "ฟอร์มแจ้งซ่อม": false,
            "รายการที่รออนุมัติ": false,
            "รายการที่รอดำเนินการ": false,
            " ประวัติรายการที่สำเร็จ": false,
            "ประวัติรายการที่ติดปัญหา": false,
            "Report": false
        },
        Drawing: {
            enabled: false,
            Marketing: false,
            Management: false,
            Engineers: false,
        },
    });

    const handleSave = async () => {
        await axios.post("http://localhost:9000/savePerMissions", {
            username,
            permissions,
        });
        alert("Saved");
    };

    const loadPermissions = async () => {

        const res = await axios.get(
            `http://localhost:9000/userPermissions?username=${username}`
        );

        const base = {
            IT: {
                enabled: false,
                "ฟอร์มร้องขอ": false,
                "ฟอร์มแจ้งซ่อม": false,
                รายการที่รออนุมัติ: false,
                "รายการที่รอดำเนินการ": false,
                " ประวัติรายการที่สำเร็จ": false,
                "ประวัติรายการที่ติดปัญหา": false,
                "Report": false
            },
            Drawing: {
                enabled: false,
                Marketing: false,
                Management: false,
                Engineers: false,
            },
        };

        const rows = Array.isArray(res.data)
            ? res.data
            : res.data.data || [];

        for (const row of rows) {
            if (base[row.module]) {
                base[row.module][row.permission] = row.enabled === 1;

                if (row.enabled === 1) {
                    base[row.module].enabled = true;
                }
            }
        }

        setPermissions(base);
    };

    useEffect(() => {
        loadPermissions();
    }, [username]);


    return (
        <div className="min-h-screen bg-[#F4F7FF]">
            <Navbar />

            <div className="max-w-5xl mx-auto pt-28 px-4 pb-20">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        User Permission
                    </h1>
                </div>

                <UserInfo
                    email={email}
                    firstname={firstname}
                    lastname={lastname}
                    username={username}
                    role={role}
                    department={department}
                    session={session}
                />

                <PermissionSection
                    title="IT"
                    items={["ฟอร์มร้องขอ", "ฟอร์มแจ้งซ่อม", "รายการที่รออนุมัติ",
                        "รายการที่รอดำเนินการ",
                        "ประวัติรายการที่สำเร็จ",
                        "ประวัติรายการที่ติดปัญหา",
                        "Report"]}
                    permissions={permissions}
                    setPermissions={setPermissions}
                />

                <div className="mt-6">
                    <PermissionSection
                        title="Drawing"
                        items={["Marketing", "Management", "Engineers"]}
                        permissions={permissions}
                        setPermissions={setPermissions}
                    />
                </div>

                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold cursor-pointer"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow cursor-pointer"
                    >
                        Save Permission
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionPage;
