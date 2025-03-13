"use client"; // ✅ Use client-side rendering for navigation

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname(); // ✅ Get current route for active styles
  const userType = localStorage.getItem('userType')

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-xl font-bold mb-6">My SideNav</h2>
      {userType === 'endUser' ?
        <nav className="space-y-4">
          <NavItem href="/create-new-video" label="Create New Video" pathname={pathname} />
          <NavItem href="/home" label="Home" pathname={pathname} />
          <NavItem href="/profile" label="Profile" pathname={pathname} />
          <NavItem href="/plan" label="Plan" pathname={pathname} />
        </nav>
        :
        <nav className="space-y-4">
          <NavItem href="/admin-dashboard" label="Dashboard" pathname={pathname} />
          <NavItem href="/profile" label="Profile" pathname={pathname} />
          <NavItem href="/plan" label="Plan" pathname={pathname} />
        </nav>
      }
    </div>
  );
}

// ✅ Reusable NavItem Component
function NavItem({ href, label, pathname }) {
  return (
    <Link href={href}>
      <div
        className={`p-3 rounded-lg cursor-pointer ${pathname === href ? "bg-blue-500" : "hover:bg-gray-700"
          }`}
      >
        {label}
      </div>
    </Link>
  );
}
