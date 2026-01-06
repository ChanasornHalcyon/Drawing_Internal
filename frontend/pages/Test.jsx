import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
const Test = () => {
    const [form, setForm] = useState();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("http://localhost:4000/ITForm",);
            console.log(res.data)
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className='w-full bg-white h-dvh'>
            <input
                type="text"
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg text-black"
            />
            <button className='bg-black w-20' onClick={handleSubmit}>
                save
            </button>
        </div>
    )
}

export default Test