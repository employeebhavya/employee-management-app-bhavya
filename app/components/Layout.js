"use client";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchTotalEmployees } from "../utils/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

const Layout = ({ children }) => {
  const router = useRouter();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const getTotalEmployees = async () => {
      const total = await fetchTotalEmployees();
      setTotalEmployees(total);
    };
    getTotalEmployees();
  }, []);

  const handleSignout = () => {
    Cookies.remove("logedin");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <aside
        className={`md:w-64 bg-gray-800 text-white overflow-y-auto ${
          isSidebarOpen ? "block pt-55px" : "hidden md:block"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            <nav>
              <Link href="/dashboard">
                <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                  <FaTachometerAlt className="mr-3" />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link href="/form">
                <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                  <FaUsers className="mr-3" />
                  <span>Manage Employees</span>
                </div>
              </Link>
              <Link href="/register">
                <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
                  <FaUserPlus className="mr-3" />
                  <span>Add New Admin</span>
                </div>
              </Link>
            </nav>
            <div className="mt-auto">
              <div
                onClick={handleSignout}
                className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu (Hamburger Menu) */}
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="fixed top-0 left-0 z-50 flex items-center justify-center h-14 w-16 bg-gray-800 text-white"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          {/* Conditionally render the logo */}
          <div className="text-xl font-bold md:hidden">
            {isSidebarOpen && (
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            )}
          </div>
          <div className="hidden md:block">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <div>Total Employees: {totalEmployees}</div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
