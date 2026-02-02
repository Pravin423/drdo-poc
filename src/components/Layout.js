import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between">
        <b>GoaDRDA CRP</b>
        <div>
          <span className="mr-4">{user.email}</span>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children}
      </main>
    </div>
  );
}
