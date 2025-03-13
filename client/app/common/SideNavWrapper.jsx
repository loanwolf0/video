"use client"; // ✅ Now we can use hooks

import { usePathname } from "next/navigation";
import SideNav from "./SideNav";
import { sideNavRoutes } from "../constants/sidenav.constant";

export default function SideNavWrapper() {
    const pathname = usePathname(); // ✅ Get current route

    const showSideNav = () => {
        if (!sideNavRoutes.includes(pathname)) return false;
        if (pathname === "/plan" && localStorage.getItem("trialEnded")) return false;
        return true;
    };

    return showSideNav() ? <SideNav /> : null; // ✅ Conditionally render SideNav
}
