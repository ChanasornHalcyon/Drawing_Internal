import React from "react";
import { Search } from "lucide-react";

const Searchbar = ({ value, onChange, placeholder = "Search..." }) => {
    return (
        <div className="
            flex items-center w-full max-w-md 
            bg-white/80 backdrop-blur-md 
            px-5 py-2.5 rounded-2xl 
            border border-gray-500
            shadow-[0_4px_14px_rgba(0,0,0,0.08)]
            focus-within:border-blue-400 
            focus-within:shadow-[0_6px_20px_rgba(28,112,211,0.18)]
            transition duration-300 ease-in-out
        ">
            <Search className="w-5 h-5 text-gray-500" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="
                    ml-3 w-full bg-transparent 
                    outline-none text-gray-700
                    placeholder-gray-400
                "
            />
        </div>
    );
};

export default Searchbar;
