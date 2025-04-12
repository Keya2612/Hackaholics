"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("overview");

  // Hide sidebar on landing page
  const showSidebar = pathname !== "/";

  // Set active section based on route
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveSection("overview");
    } else if (pathname === "/aptitude/learning") {
      setActiveSection("aptitude-learning");
    } else if (pathname === "/aptitude/practice") {
      setActiveSection("aptitude-practice");
    } else if (pathname === "/group-discussion/learning") {
      setActiveSection("gd-learning");
    } else if (pathname === "/group-discussion/practice") {
      setActiveSection("gd-practice");
    } else if (pathname === "/interview/learning") {
      setActiveSection("interview-learning");
    } else if (pathname === "/interview/practice") {
      setActiveSection("interview-practice");
    } else if (pathname === "/analytics") {
      setActiveSection("analytics");
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      {/* Main Content */}
      <div className={showSidebar ? "flex-1 bg-gray-50" : "w-full"}>
        {children}
      </div>
    </div>
  );
}