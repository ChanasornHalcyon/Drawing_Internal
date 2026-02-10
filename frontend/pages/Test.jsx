import React, { useState } from "react";
import axios from "axios";

const Test = () => {
    const [form, setForm] = useState({
        to: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post(
                "http://localhost:9000/sendMailTest",
                form
            );
            console.log(res.data);
            alert("ส่งเมลแล้ว");
        } catch (err) {
            console.error(err);
            alert("ส่งเมลไม่สำเร็จ");
        }
    };

    return (
        <div className="w-full bg-white h-dvh p-6 space-y-3">
            <input
                name="to"
                placeholder="to (email)"
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
            />

            <input
                name="subject"
                placeholder="subject"
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
            />

            <textarea
                name="message"
                placeholder="message"
                rows={5}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
            />

            <button
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleSubmit}
            >
                Send Mail
            </button>
        </div>
    );
};

export default Test;
