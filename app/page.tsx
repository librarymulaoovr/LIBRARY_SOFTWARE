import Link from "next/link";
import { Button } from "@/components/ui/button";
import Marquee from "react-fast-marquee";
import { BookOpen, Phone, Mail, Clock, MapPin, Users, Info } from "lucide-react";
import { Anek_Malayalam } from "next/font/google";
import { createClient } from "@/lib/supabase/server";

const malayalamFont = Anek_Malayalam({ subsets: ['malayalam'], weight: ['400', '500', '600', '700', '800'] });

export default async function Home() {
  const supabase = await createClient();
  const { data: programs } = await supabase.from("programs").select("*").order("created_at", { ascending: true });
  const validPrograms = programs || [];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw] bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#020617]">

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center text-center px-4 py-8 sm:py-24">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-yellow-600 blur-[100px]"></div>
        </div>
        <div className="z-10 w-full max-w-5xl space-y-4 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center justify-center flex-1">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <h2 className={`${malayalamFont.className} text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight drop-shadow-2xl leading-[1.2] px-4 text-center`}>
              {/* Desktop view: "വിജ്ഞാനപോഷിണിയിലേക്ക്" on one line */}
              <span className="hidden sm:inline text-white drop-shadow-lg">വിജ്ഞാനപോഷിണി</span>

              {/* Mobile view: "വിജ്ഞാന" on one line, "പോഷിണി" on the next line */}
              <span className="sm:hidden text-white drop-shadow-lg block">വിജ്ഞാന</span>
              <span className="sm:hidden text-white drop-shadow-lg block">പോഷിണി</span>

              <br className="hidden sm:block" />

              {/* "ഗ്രന്ഥശാല" hidden on mobile, shown on desktop */}
              <span className="hidden sm:inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-xl mt-2 sm:mt-4 py-2">
                ഗ്രന്ഥശാല
              </span>
            </h2>
            <p className={`${malayalamFont.className} text-xs sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto font-medium drop-shadow-md px-4 leading-relaxed text-center`}>
              നാടിന്റെ അറിവുകൂടാരത്തിലേക്ക് സ്വാഗതം. ലൈബ്രറിയിലെ ആയിരക്കണക്കിന് <br className="hidden sm:block" /> പുസ്തകങ്ങളിൽ നിന്ന് നിങ്ങൾക്കിഷ്ടമുള്ളവ കണ്ടെത്താനും നിങ്ങളുടെ <br className="hidden sm:block" /> വായനായാത്ര കൂടുതൽ എളുപ്പമാക്കാനും ഈ വെബ്സൈറ്റ് സഹായിക്കും.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4 w-full px-4 max-w-sm sm:max-w-none">
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-5 text-sm sm:text-lg shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all">
                <BookOpen className="mr-2" size={20} />
                Browse Catalog
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-5 text-sm sm:text-lg font-bold bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/30 backdrop-blur-sm transition-all">
                Librarian Login
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-300 bg-black/40 inline-block px-5 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
              Are you a member? <Link href="/member-login" className="text-yellow-400 font-semibold hover:underline ml-1 hover:text-yellow-300 transition-colors">Login here</Link>
            </p>

            {/* Elegant Watermark */}
            <div className="group flex items-center gap-3 text-[9px] sm:text-xs text-gray-500/60 font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:text-gray-400">
              <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-gray-500/40 group-hover:to-yellow-500/40 transition-colors duration-500"></span>
              <span>Created by <Link href="https://www.instagram.com/ad.x_il/" target="_blank" rel="noopener noreferrer" className="text-gray-400 group-hover:text-yellow-400 transition-colors duration-300">Adhil</Link></span>
              <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-gray-500/40 group-hover:from-yellow-500/40 transition-colors duration-500"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTIFICATIONS & PROGRAMS (MARQUEE) */}
      <section className="text-white flex items-center overflow-hidden w-full">
        <Marquee speed={60} gradient={false} className="py-4 flex-1 w-full max-w-full">
          <div className="flex items-center gap-8 sm:gap-16 text-sm sm:text-lg font-medium px-4 sm:px-8 whitespace-nowrap">
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">🌟 <span className="text-yellow-300">New Arrival:</span> 100+ new  books added!</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">⏰ <span className="text-yellow-300">Notice:</span> Library closed on tuesday.</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">🎉 <span className="text-yellow-300">Welcome:</span> New members get extended limits!</span>
          </div>
        </Marquee>
      </section>

      {/* 2. PROGRAMS SECTION */}
      <section className="py-20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-center uppercase text-white drop-shadow-sm">Gallery</h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full shadow-sm"></div>
          <p className="text-center text-gray-300 mt-4 max-w-2xl mx-auto font-medium">വിജ്ഞാനപോഷിണി ഗ്രന്ഥശാല മുളവൂർ </p>
        </div>

        <Marquee speed={40} gradient={false} pauseOnHover className="w-full">
          <div className="flex pb-4">

            {validPrograms.length > 0 ? validPrograms.map((program) => {
              let badgeColor = "bg-gray-500 text-white";
              if (program.category === "Weekly Series") badgeColor = "bg-yellow-400 text-black";
              else if (program.category === "Special Event") badgeColor = "bg-blue-500 text-white";
              else if (program.category === "Workshop") badgeColor = "bg-green-500 text-white";
              else if (program.category === "Community") badgeColor = "bg-purple-500 text-white";
              else if (program.category === "Daily") badgeColor = "bg-orange-500 text-white";

              return (
                <div key={program.id} className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
                  <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={program.image_url} alt={program.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className={`${badgeColor} text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm`}>{program.category}</span>
                      <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">{program.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2">{program.description}</p>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="w-full px-6 py-12 text-center text-gray-400 font-medium">
                <p>More programs coming soon! Stay tuned.</p>
              </div>
            )}

          </div>
        </Marquee>
      </section>

      {/* 3. COMPREHENSIVE FOOTER */}
      <footer className="text-gray-300 py-16 px-6 md:px-12 border-t border-white/5 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Timings */}
          <div className="space-y-4">
            <h3 className="text-yellow-400 text-xl font-bold flex items-center gap-2 border-b border-gray-700 pb-2">
              <Clock size={20} /> Library Timings
            </h3>
            <ul className="space-y-3 mt-4">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Tuesday - Friday</span>
                <span className="text-white">3:00 PM - 7:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Saturday</span>
                <span className="text-white">3:00 PM - 7:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Monday</span>
                <span className="text-red-400 font-semibold">Closed</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="font-medium text-gray-400">Public Holidays</span>
                <span className="text-white">Closed</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Details & Contact */}
          <div className="space-y-4">
            <h3 className="text-yellow-400 text-xl font-bold flex items-center gap-2 border-b border-gray-700 pb-2">
              <MapPin size={20} /> Contact & Details
            </h3>
            <div className="space-y-4 mt-4 text-sm leading-relaxed text-gray-400 break-words">
              <p className="flex items-start gap-3">
                <span className="bg-gray-800 p-2 rounded text-gray-300 shrink-0 mt-0.5"><MapPin size={16} /></span>
                <span>VIJNANA POSHINI GRANDHASALA MULAVOOR,<br />MUVATTUPUZHA,REG NO : 2557/58 </span>
              </p>
              <p className="flex items-center gap-3">
                <span className="bg-gray-800 p-2 rounded text-gray-300 shrink-0"><Phone size={16} /></span>
                <span className="hover:text-yellow-400 cursor-pointer transition-colors">+91 9605659222</span>
              </p>
              <p className="flex items-center gap-3 break-all sm:break-normal">
                <span className="bg-gray-800 p-2 rounded text-gray-300 shrink-0"><Mail size={16} /></span>
                <span className="hover:text-yellow-400 cursor-pointer transition-colors">vinjanaposhinigrandhasalamulav@gmail.com</span>
              </p>
              <div className="pt-4 border-t border-gray-800 mt-4">
                <p className="font-bold text-white">Chief Librarian:</p>
                <p className="text-yellow-500 font-medium">Binu</p>
              </div>
            </div>
          </div>

          {/* Column 3: Committee Details */}
          <div className="space-y-4">
            <h3 className="text-yellow-400 text-xl font-bold flex items-center gap-2 border-b border-gray-700 pb-2">
              <Users size={20} /> Management Committee
            </h3>
            <ul className="space-y-3 mt-4 text-sm">
              <li className="flex flex-col bg-gray-800/50 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="text-white font-semibold">O.p kuryakos</span>
                <span className="text-yellow-500 text-xs">President</span>
              </li>
              <li className="flex flex-col bg-gray-800/50 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="text-white font-semibold">Vijayan</span>
                <span className="text-yellow-500 text-xs">Secretary</span>
              </li>
              <li className="flex flex-col bg-gray-800/50 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="text-white font-semibold">Adhil Muhammed, Ali Aslam</span>
                <span className="text-yellow-500 text-xs">Technical</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>&copy; {new Date().getFullYear()} <Link href="https://www.instagram.com/ad.x_il/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Adhilmulavoor</Link>. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Accessibility</span>
          </div>
        </div>
      </footer>

    </div >
  );
}
