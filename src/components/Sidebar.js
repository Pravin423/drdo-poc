import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { SIDEBAR_CONFIG } from "../config/sidebarConfig";

export default function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menus = SIDEBAR_CONFIG[user.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <div className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center font-bold">
          CRP
        </div>
        <span className="text-lg font-semibold">GoaDRDA CRP</span>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {menus.map((group, idx) => (
          <div key={idx} className="mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              {group.section}
            </p>

            <ul className="space-y-1">
              {group.items.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path}
                    className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="border-t px-4 py-4">
        <p className="text-sm font-semibold">{user.email}</p>
        <p className="text-xs text-gray-500 capitalize">{user.role}</p>

        <button
          onClick={logout}
          className="mt-3 w-full bg-red-500 text-white text-sm py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
