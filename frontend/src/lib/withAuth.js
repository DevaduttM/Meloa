import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace('/signin');
        } else {
          router.replace('/home');
        }
        setCheckingAuth(false);
      });

      return () => unsubscribe();
    }, []);

    if (checkingAuth) {
      return (
        <div className="flex justify-center items-center flex-col fixed top-0 left-0 h-screen w-screen bg-[#171717] text-white z-[100]">
            <img src="/logo_img_only.png" alt="Meloa Logo" className="w-24 h-24 mb-4" />
            <p className="text-lg font-syne">Loading...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
