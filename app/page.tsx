import Link from "next/link";

const features = [
  {
    title: "Gestión de Turnos",
    description: "Calendarizá turnos al instante. Vista diaria, semanal y por profesional con bloques de tiempo configurables.",
    icon: "📅",
  },
  {
    title: "Perfil Público",
    description: "Cada barbería tiene su link público para que los clientes reserven online sin necesidad de registrarse.",
    icon: "🔗",
  },
  {
    title: "Control de Staff",
    description: "Administrá tu equipo con roles, comisiones por servicio y horarios personalizados para cada profesional.",
    icon: "👤",
  },
  {
    title: "Catálogo de Servicios",
    description: "Definí servicios con precios, duración y asignación a profesionales específicos.",
    icon: "✂️",
  },
  {
    title: "Gestión de Clientes",
    description: "Historial completo de visitas, gasto total, cliente VIP y búsqueda inteligente.",
    icon: "👥",
  },
  {
    title: "Finanzas",
    description: "Resumen de ingresos, comisiones pendientes, liquidaciones y reportes por período.",
    icon: "💰",
  },
  {
    title: "Multi-Tenant",
    description: "Arquitectura SaaS: cada barbería es un tenant independiente con sus propios datos y configuración.",
    icon: "🏢",
  },
  {
    title: "Panel de Control",
    description: "Dashboard en tiempo real con estadísticas de turnos, ingresos, staff activo y métricas semanales.",
    icon: "📊",
  },
];

const steps = [
  { step: "1", title: "Registrá tu barbería", description: "Completá los datos de tu negocio en menos de 2 minutos." },
  { step: "2", title: "Configurá servicios y staff", description: "Agregá tus servicios, definí precios y sumá a tu equipo." },
  { step: "3", title: "Compartí tu link público", description: "Tus clientes reservan online sin necesidad de registrarse." },
  { step: "4", title: "Gestioná desde el dashboard", description: "Controlá turnos, clientes y finanzas en un solo lugar." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Groomy
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-9 px-4 text-sm rounded-lg font-medium bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all"
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,50,200,0.15)_0%,transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-8">
              SaaS para barberías y centros de estética
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Gestioná tu barbería
              </span>
              <br />
              <span className="text-zinc-100">desde cualquier lugar</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
              Turnos online, perfil público para tus clientes, control de staff,
              finanzas y más. Todo en un solo lugar, sin complicaciones.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-12 px-8 text-base rounded-lg font-medium bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all"
              >
                Crear mi barbería gratis
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 text-base rounded-lg font-medium border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
              Todo lo que necesitás para tu negocio
            </h2>
            <p className="mt-4 text-zinc-500 text-lg max-w-2xl mx-auto">
              Un panel completo con las herramientas que toda barbería o centro de estética necesita para crecer.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 hover:border-zinc-700 transition-colors"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
              Empezá en 4 pasos
            </h2>
            <p className="mt-4 text-zinc-500 text-lg">
              Configurás tu barbería en minutos, no en horas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center text-lg font-bold text-white mx-auto shadow-lg shadow-purple-500/25">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="rounded-2xl border border-purple-500/20 bg-linear-to-br from-purple-900/20 via-zinc-900/50 to-pink-900/20 p-12 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
              ¿Listo para digitalizar tu barbería?
            </h2>
            <p className="mt-4 text-zinc-500 text-lg max-w-xl mx-auto">
              Unite a las barberías que ya gestionan sus turnos, clientes y finanzas con Groomy.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-12 px-8 text-base rounded-lg font-medium bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all"
              >
                Crear mi barbería gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-lg font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Groomy
            </span>
            <p className="text-sm text-zinc-600">
              &copy; {new Date().getFullYear()} Groomy. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
