import "@/styles/globals.css";
import AutoLogout from "../components/AutoLogout";

export default function App({ Component, pageProps }) {
  return (
    <AutoLogout>
      <Component {...pageProps} />
    </AutoLogout>
  );
}
