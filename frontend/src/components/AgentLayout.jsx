import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AgentLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-56"}`}>
        {children}
      </div>
    </div>
  );
}
