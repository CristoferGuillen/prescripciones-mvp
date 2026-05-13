export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium text-slate-500">
          Prescripciones MVP
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Frontend inicializado correctamente
        </h1>

        <p className="mt-4 text-slate-600">
          Next.js, TypeScript y Tailwind están listos. El siguiente sprint
          implementará autenticación, manejo de token y redirección por rol.
        </p>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            API configurada en:{' '}
            <span className="font-mono">
              {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}