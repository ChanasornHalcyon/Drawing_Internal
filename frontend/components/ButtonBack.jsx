"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ButtonBack = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
           className=" flex items-center mx-auto px-3 py-2 gap-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white transition border cursor-pointer"
        >
            <ArrowLeft size={18} />
            Back
        </button>
    );
};

export default ButtonBack;
