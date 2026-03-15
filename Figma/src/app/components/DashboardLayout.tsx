import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Hospital, 
  MessageSquare, 
  FileText, 
  Bell, 
  Activity,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Hospitals", href: "/hospitals", icon: Hospital },
  { name: "AI Chatbot", href: "/chatbot", icon: MessageSquare },
  { name: "Blood Analyzer", href: "/blood-analyzer", icon: FileText },
  { name: "Medicine Reminder", href: "/medicine-reminder", icon: Bell },
  { name: "Health Risk", href: "/health-risk", icon: Activity },
];

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800 rounded-lg shadow-lg border border-cyan-500/20"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6 text-cyan-400" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-cyan-500/20 shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 border-b border-cyan-500/20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                VitaNexis
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-500/30"
                      : "text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-500/20">
            <div className="text-xs text-gray-400 text-center">
              © 2026 VitaNexis
              <br />
              <span className="text-cyan-400">Healthcare AI Assistant</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}