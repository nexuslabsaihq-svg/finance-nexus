
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DashboardPreview = () => {
  useEffect(() => {
    gsap.fromTo(
      '.dashboard-preview-container',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'ease',
        scrollTrigger: {
          trigger: '.dashboard-preview-container',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section className="py-20 px-4 bg-light">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="inline-block py-1 px-3.5 mb-4 text-xs font-semibold text-white bg-blue-500 rounded-full border border-blue-400">
          Disponible próximamente
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-dark display">
          Tu panel financiero, siempre bajo control
        </h2>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
          Visualiza ingresos, egresos y el rendimiento de tu negocio en tiempo real, desde cualquier dispositivo.
        </p>
      </div>

      <div
        className="dashboard-preview-container max-w-4xl mx-auto bg-[#0A0A0F] rounded-xl shadow-2xl p-4 border border-gray-800"
        style={{
          boxShadow: '0 0 60px rgba(0, 212, 255, 0.15), 0 0 120px rgba(0, 212, 255, 0.05)',
          transform: 'perspective(1000px) rotateX(2deg) rotateY(-3deg)',
          transition: 'transform 0.5s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(-3deg)')}
      >
        {/* Browser Frame */}
        <div className="flex items-center pb-3 border-b border-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center text-sm text-gray-400">
            finance-nexus.web.app/dashboard
          </div>
        </div>

        <div className="flex mt-4">
          {/* Sidebar */}
          <div className="hidden md:block w-48 bg-[#111118] rounded-lg p-4 space-y-4">
            <div className="text-gray-300">🏠 Inicio</div>
            <div className="text-gray-300">📊 Finanzas</div>
            <div className="text-gray-300">🤖 IA</div>
            <div className="text-gray-300">👥 Clientes</div>
            <div className="text-gray-300">📋 Reportes</div>
            <div className="text-gray-300">⚙️ Config</div>
          </div>

          {/* Main Content */}
          <div className="flex-1 md:pl-6">
            <h3 className="text-xl font-bold text-white mb-6">Bienvenido, Isaac</h3>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#1A1A2E] border border-[#00D4FF20] rounded-lg p-4">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">$2.4M</p>
              </div>
              <div className="bg-[#1A1A2E] border border-[#00D4FF20] rounded-lg p-4">
                <p className="text-sm text-gray-400">Ingr.</p>
                <p className="text-2xl font-bold text-white">+$890k</p>
              </div>
              <div className="bg-[#1A1A2E] border border-[#00D4FF20] rounded-lg p-4">
                <p className="text-sm text-gray-400">Egr.</p>
                <p className="text-2xl font-bold text-white">-$320k</p>
              </div>
              <div className="bg-[#1A1A2E] border border-[#00D4FF20] rounded-lg p-4">
                <p className="text-sm text-gray-400">Clien.</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#0D0D1A] rounded-lg p-4 mb-6">
              <svg width="100%" height="120" className="overflow-visible">
                <g>
                  <rect x="10%" y="30" width="15%" height="90" fill="#00D4FF" />
                  <rect x="30%" y="60" width="15%" height="60" fill="#00D4FF" />
                  <rect x="50%" y="20" width="15%" height="100" fill="#00D4FF" />
                  <rect x="70%" y="80" width="15%" height="40" fill="#00D4FF" />
                </g>
              </svg>
            </div>

            {/* Table */}
            <div className="bg-[#0D0D1A] rounded-lg p-4">
              <table className="w-full text-sm text-left text-gray-400">
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">2024-07-22</td>
                    <td className="py-2">$1,200.00</td>
                    <td className="py-2 text-green-400">Pagado</td>
                  </tr>
                  <tr>
                    <td className="py-2">2024-07-21</td>
                    <td className="py-2">$750.50</td>
                    <td className="py-2 text-yellow-400">Pendiente</td>
                  </tr>
                   <tr className="bg-[#111118] border-b border-gray-700">
                    <td className="py-2">2024-07-22</td>
                    <td className="py-2">$1,200.00</td>
                    <td className="py-2 text-green-400">Pagado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
