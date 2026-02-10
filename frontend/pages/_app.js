import "@/styles/globals.css";
import AutoLogout from "../components/AutoLogout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const publicPages = ["/"];
    const isPublic = publicPages.includes(router.pathname);
    const username =
      typeof window !== "undefined" ? localStorage.getItem("username") : null;

    if (!isPublic && !username) {
      router.replace("/");
    }
  }, [router.pathname]);

  return (
    <AutoLogout>
      <Component {...pageProps} />
    </AutoLogout>
  );
}
