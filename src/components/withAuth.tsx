import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: any) {
  return function withAuth(props: any) {
    const isBrowser = typeof window !== "undefined";
    const session = isBrowser ? localStorage.getItem('token') || false : false;
    useEffect(() => {
      if (!session) {
        redirect('/');
      }
    }, []);

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
