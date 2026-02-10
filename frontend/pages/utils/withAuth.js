import { useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const username = localStorage.getItem("username");

      if (!username) {
        router.replace("/");
      }
    }, []);

    return <Component {...props} />;
  };
}
