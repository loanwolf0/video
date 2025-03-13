"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminRoutes, userRoutes, commonRoutes } from "../constants/sidenav.constant";

export default function AuthenticateHandler({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {

        // ✅ Get user type from Local store
        const userId = localStorage.getItem('userId');
        const userType = localStorage.getItem('userType');
        console.log(pathname, "pathname ???????????????");
        

        if (!userId) {
            router.push("/login"); // ✅ Redirect unauthenticated users
            return
        }

        // if (!commonRoutes.includes(pathname)) {
        //     console.log("hello log in page", pathname);
        //     router.push("/login"); // ✅ Redirect unauthenticated users
        //     return;
        // }

        // Redirect authenticated users away from public routes
        if (commonRoutes.includes(pathname)) {
            if (userType === "admin") router.push("/");
            if (userType === "endUser") router.push("/home");
            return;
        }

        // Prevent unauthorized access to role-specific pages
        if (userType === "admin" && (userRoutes.includes(pathname))) {
            console.log("user Admin");

            router.push("/");
        }

        if (userType === "endUser" && (adminRoutes.includes(pathname))) {
            console.log("userOnly");

            router.push("/");
        }

    }, [pathname]);

    return <>{children}</>;
}
