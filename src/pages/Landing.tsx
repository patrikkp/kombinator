import { Link } from 'react-router-dom'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function Landing() {
  return (
    <>
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center mb-24">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-8 uppercase text-white">
              GARANT
            </h1>
            
            <p className="text-2xl md:text-3xl font-light text-gray-300 max-w-3xl mx-auto">
              Digitalni čuvar <span className="text-[#ff3131]">tvojih garancija</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
              <Link
                to="/auth"
                className="group relative px-8 py-4 bg-[#ff3131] text-white uppercase tracking-wider text-sm font-medium transition-all duration-300 hover:bg-[#ff3131]/90 rounded-lg"
              >
                <span className="relative z-10">Započni Besplatno</span>
                <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-lg" />
              </Link>
              
              <Link
                to="/auth"
                className="px-8 py-4 border border-gray-700 text-gray-300 uppercase tracking-wider text-sm font-medium hover:border-[#ff3131] hover:text-[#ff3131] transition-all duration-300 rounded-lg"
              >
                Prijavi Se
              </Link>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8 text-xs text-gray-500">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>SSL Šifrovanje</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24">
            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-[#ff3131]/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="rounded-2xl bg-[#ff3131]/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                <svg className="w-7 h-7 text-[#ff3131]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#ff3131] transition-colors">Sigurno Čuvanje</h3>
              <p className="text-sm text-gray-400 font-light">Sve garancije na jednom mjestu, uvijek dostupne</p>
            </div>

            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="rounded-2xl bg-blue-400/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Brzo Upload</h3>
              <p className="text-sm text-gray-400 font-light">Uslikaj račun i spremi u sekundi</p>
            </div>

            <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-emerald-400/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
              <div className="rounded-2xl bg-emerald-400/10 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Notifikacije</h3>
              <p className="text-sm text-gray-400 font-light">Automatski podsjetnik prije isteka garancije</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
