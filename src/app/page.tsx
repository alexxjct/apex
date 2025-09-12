export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center text-white">
      <h1 className="text-6xl font-extrabold mb-6 tracking-wide text-blue-500">
        Apex
      </h1>
      <p className="max-w-xl text-lg text-green-400 mb-8">
        Corporación de biotecnología futurista dedicada a la innovación en genética, IA y prótesis inteligentes.
      </p>
      <div className="space-x-6">
        <a
          href="/login"
          className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </a>
        <a
          href="/register"
          className="px-6 py-3 rounded-md border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition"
        >
          Registrarse
        </a>
      </div>
    </main>
  );
}
