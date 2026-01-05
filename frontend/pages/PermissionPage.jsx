import { useRouter } from "next/router";
import { useState } from "react";
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

const PermissionItem = ({ title }) => (
    <div className="flex items-center justify-between px-5 py-5 rounded-2xl border border-gray-200 bg-gray-50">
        <p className="text-lg font-semibold text-gray-800">{title}</p>
        <IOSToggle />
    </div>
);

const PermissionSection = ({ title, items }) => {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 rounded-full bg-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>
                <IOSToggle checked={enabled} onChange={() => setEnabled(!enabled)} />
            </div>

            <div className={`space-y-4 ${!enabled ? "opacity-40 pointer-events-none" : ""}`}>
                {items.map((item) => (
                    <PermissionItem key={item} title={item} />
                ))}
            </div>
        </div>
    );
};

const UserInfo = ({ name, username, role }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Name</p>
                <p className="text-lg font-semibold text-black">{name || "-"}</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xs uppercase text-black">Username</p>
                <p className="text-lg font-semibold text-black">{username || "-"}</p>
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
    const { username, name, role } = router.query;

    return (
        <div className="min-h-screen bg-[#F4F7FF]">
            <Navbar />

            <div className="max-w-5xl mx-auto pt-28 px-4 pb-20">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">User Permission</h1>
                    <p className="text-sm text-gray-500">
                        Control access and permission for each module
                    </p>
                </div>

                <UserInfo name={name} username={username} role={role} />

                <PermissionSection
                    title="IT"
                    items={["ฟอร์มร้องขอ", "ฟอร์มแจ้งซ่อม", "Approve"]}
                />

                <div className="mt-6">
                    <PermissionSection
                        title="Drawing"
                        items={["Marketing", "Sales", "Engineers"]}
                    />
                </div>

                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold"
                    >
                        Back
                    </button>
                    <button
                        className="px-8 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
                    >
                        Save Permission
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PermissionPage;
