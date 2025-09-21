"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error en el login");
        setLoading(false);
        return;
      }

      if (data.token) {
        // MVP: guardamos token en localStorage. Para producción considera cookies httpOnly
        localStorage.setItem("apex_token", data.token);
        router.push("/dashboard"); // crea la página /dashboard después
      } else {
        setError("No se recibió token del servidor.");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Error de red");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0b0b0b] border border-gray-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">Iniciar sesión — Apex</h2>
        <p className="text-sm text-green-300 mb-6">Accede a tu cuenta para ver recursos e información.</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej. investigador01"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Contraseña</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-white"
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-green-300 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </main>
  );
}
