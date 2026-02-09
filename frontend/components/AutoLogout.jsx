"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AutoLogout({ children }) {
    const router = useRouter();
    const TIMEOUT = 1 * 60 * 1000;

    useEffect(() => {
        let timer;
        const clearStorage = () => {
            localStorage.removeItem("userId");
            localStorage.removeItem("fname");
            localStorage.removeItem("lname");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("department");
            localStorage.removeItem("lastClosedTime");
            sessionStorage.removeItem("loginSuccess");
        };
        const handleLogout = () => {
            clearStorage();
            router.push("/");
        };

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(handleLogout, TIMEOUT);
        };

        // ================================
        //  ตรวจตอนเปิดเว็บใหม่
        // ================================
        const lastClosed = localStorage.getItem("lastClosedTime");
        if (lastClosed) {
            const diff = Date.now() - Number(lastClosed);
            if (diff > TIMEOUT) {
                // ปิดแท็บนานเกิน 1 นาที → ลบข้อมูล
                clearStorage();
                router.push("/");
            }
        }

        // ================================
        // set lastClosedTime ตอนปิดแท็บ
        // ================================
        const saveCloseTime = () => {
            localStorage.setItem("lastClosedTime", Date.now().toString());
        };
        window.addEventListener("beforeunload", saveCloseTime);

        // ================================
        // Inactivity timeout
        // ================================
        const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
            window.removeEventListener("beforeunload", saveCloseTime);
            clearTimeout(timer);
        };
    }, []);

    return <>{children}</>;
}
