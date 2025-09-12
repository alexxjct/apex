"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserInfo = {
  userId: string;
  username: string;
  role: "user" | "admin";
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("apex_token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          // token inválido o expirado
          localStorage.removeItem("apex_token");
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (err: any) {
        setError(err?.message || "Error de red");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("apex_token");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Cargando dashboard...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <div>Error: {error}</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-[#071017] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">Dashboard — Apex</h1>
            <p className="text-sm text-green-300">Bienvenido, {user.username} ({user.role})</p>
          </div>
          <div className="space-x-3">
            <button onClick={() => router.push("/")} className="px-3 py-1 bg-gray-800 rounded">Home</button>
            <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded">Cerrar sesión</button>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-blue-300 mb-2">Tu espacio</h2>
          <p className="text-sm text-gray-300">Accede a los recursos y la información a la que tienes permiso.</p>
        </section>

        {user.role === "admin" ? (
          <section className="bg-[#061219] p-4 rounded border border-gray-800">
            <h3 className="font-semibold text-green-300 mb-2">Panel de administrador</h3>
            <p className="text-sm text-gray-300 mb-3">
              Puedes ver información administrativa. (Lista de usuarios abajo)
            </p>

            <AdminUsersList tokenKey="apex_token" />
          </section>
        ) : (
          <section className="bg-[#061219] p-4 rounded border border-gray-800">
            <h3 className="font-semibold text-blue-300 mb-2">Área de usuario</h3>
            <p className="text-sm text-gray-300">
              Gracias por ser parte de Apex. Aquí verás contenido exclusivo según tu cuenta.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

/* Componente para listar usuarios (solo admin). */
function AdminUsersList({ tokenKey }: { tokenKey: string }) {
  const [users, setUsers] = useState<Array<{ username: string; role: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(tokenKey);
      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setErr(data.error || "No se pudieron cargar usuarios");
          return;
        }
        setUsers(data.users || []);
      } catch (e: any) {
        setErr(e?.message || "Error de red");
      } finally {
        setLoading(false);
      }
    })();
  }, [tokenKey]);

  if (loading) return <div className="text-sm text-gray-400">Cargando usuarios...</div>;
  if (err) return <div className="text-sm text-red-400">Error: {err}</div>;

  return (
    <div className="mt-3">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400">
            <th className="pb-2">Usuario</th>
            <th className="pb-2">Rol</th>
            <th className="pb-2">Creado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td className="py-2">{u.username}</td>
              <td className="py-2">{u.role}</td>
              <td className="py-2">{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
