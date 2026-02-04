import React from "react";

const SearchFormIT = ({ searchValue, setSearchValue }) => {
  return (
   <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="ค้นหาข้อมูล เช่น ผู้ร้องขอ / แผนก / รายละเอียด"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className=" flex items-center w-full max-w-md 
                    bg-white/80 backdrop-blur-md 
                    px-5 py-2.5 rounded-2xl 
                    border border-gray-500
                    shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                    focus-within:border-blue-400 
                    focus-within:shadow-[0_6px_20px_rgba(28,112,211,0.18)]
                    transition duration-300 ease-in-out text-black  "
      />
    </div>
  );
};

export default SearchFormIT;
