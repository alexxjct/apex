"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password.trim()) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return;
      }

      setSuccess("Usuario registrado con éxito. Redirigiendo...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0b0b0b] border border-gray-800 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Registro — Apex</h2>
        <p className="text-sm text-blue-300 mb-6">Crea una cuenta para acceder a recursos exclusivos.</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-400 bg-green-900/20 p-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Usuario</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 bg-black border border-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-green-600 hover:bg-green-700 rounded font-medium transition disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-300 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </main>
  );
}
