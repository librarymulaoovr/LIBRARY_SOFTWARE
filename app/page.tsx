import Link from "next/link";
import { Button } from "@/components/ui/button";
import Marquee from "react-fast-marquee";
import { BookOpen, Phone, Mail, Clock, MapPin, Users, Info } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden w-full max-w-[100vw]">

      {/* 1. HERO SECTION */}
      <section className="relative w-full flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden min-h-[calc(100vh-64px)]">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-yellow-600 blur-[100px]"></div>
        </div>
        <div className="z-10 w-full max-w-5xl space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl leading-tight px-2">
            WELCOME TO <br className="sm:hidden" /><span className="text-yellow-400">ANSIL'S LIBRARY</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto font-medium drop-shadow-md px-4 leading-relaxed">
            Your gateway to knowledge. Access the library catalog, discover new books, and manage your reading journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full px-4">
            <Link href="/catalog" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-6 text-base sm:text-lg shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all">
                <BookOpen className="mr-2" size={24} />
                Browse Catalog
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto mt-4 sm:mt-0">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-bold bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/30 backdrop-blur-sm transition-all">
                Librarian Login
              </Button>
            </Link>
          </div>

          <div className="pt-8 pt-12">
            <p className="text-gray-300 bg-black/40 inline-block px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
              Are you a member? <Link href="/member-login" className="text-yellow-400 font-semibold hover:underline ml-2 hover:text-yellow-300 transition-colors">Login here</Link>
            </p>
          </div>
        </div>
      </section>

      {/* 2. NOTIFICATIONS & PROGRAMS (MARQUEE) */}
      <section className="bg-blue-900 text-white py-4 border-y-4 border-yellow-400 shadow-inner flex items-center overflow-hidden w-full">
        <div className="bg-yellow-400 text-black font-bold px-6 py-2 ml-4 rounded-r flex-shrink-0 z-10 hidden sm:flex items-center gap-2">
          <Info size={18} /> UPDATES
        </div>
        <Marquee speed={60} gradient={false} className="py-2 flex-1 w-full max-w-full">
          <div className="flex items-center gap-8 sm:gap-16 text-sm sm:text-lg font-medium px-4 sm:px-8 whitespace-nowrap">
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">🌟 <span className="text-yellow-300">New Arrival:</span> 100+ new technical books added!</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">📅 <span className="text-yellow-300">Upcoming Event:</span> Author Talk - Friday at 4 PM.</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">⏰ <span className="text-yellow-300">Notice:</span> Library closed this Sunday.</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">📖 <span className="text-yellow-300">Book Club:</span> Join our discussion group next Wed!</span>
            <span className="flex items-center gap-1 sm:gap-2 shrink-0">🎉 <span className="text-yellow-300">Welcome:</span> New members get extended limits!</span>
          </div>
        </Marquee>
      </section>

      {/* 2. PROGRAMS SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-100 w-full overflow-hidden border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-center uppercase text-slate-900 drop-shadow-sm">Our Programs</h2>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto mt-4 rounded-full shadow-sm"></div>
          <p className="text-center text-slate-600 mt-4 max-w-2xl mx-auto font-medium">Join our vibrant community events, workshops, and gatherings designed for all ages and interests.</p>
        </div>

        <Marquee speed={40} gradient={false} pauseOnHover className="w-full">
          <div className="flex pb-4">

            {/* Card 1 */}
            <div className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop" alt="Yoga Session" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Weekly Series</span>
                  <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">Evening Yoga</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">Every Tuesday & Thursday at 6:00 PM in the courtyard. Bring your own mat and join us for a relaxing session to unwind.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop" alt="Author Talk" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Special Event</span>
                  <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">Author Meet & Greet</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">Join us for an exclusive chat and book signing this Friday with award-winning local authors.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop" alt="Coding Bootcamp" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Workshop</span>
                  <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">Kids Coding Bootcamp</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">Learn Python and build games. Starts next month. Registration required at the front desk.</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop" alt="Book Club" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Community</span>
                  <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">Fiction Book Club</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">Discussing 'The Midnight Library' this Wednesday. All avid readers are welcome to join the debate.</p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="w-[100vw] sm:w-[50vw] md:w-[33vw] lg:w-[25vw] px-3 shrink-0">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden shadow-md relative group cursor-pointer border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-100"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=600&auto=format&fit=crop" alt="Silent Reading" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Daily</span>
                  <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-yellow-400 transition-colors">Silent Reading Hour</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">Drop in and read quietly in our newly renovated west wing. Monday-Friday 1PM-2PM.</p>
                </div>
              </div>
            </div>

          </div>
        </Marquee>
      </section>

      {/* 3. COMPREHENSIVE FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-6 md:px-12 border-t-8 border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Timings */}
          <div className="space-y-4">
            <h3 className="text-yellow-400 text-xl font-bold flex items-center gap-2 border-b border-gray-700 pb-2">
              <Clock size={20} /> Library Timings
            </h3>
            <ul className="space-y-3 mt-4">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Monday - Friday</span>
                <span className="text-white">8:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Saturday</span>
                <span className="text-white">9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span className="font-medium text-gray-400">Sunday</span>
                <span className="text-red-400 font-semibold">Closed</span>
              </li>
              <li className="flex justify-between pt-2">
                <span className="font-medium text-gray-400">Public Holidays</span>
                <span className="text-white">10:00 AM - 2:00 PM</span>
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
                <span>123 Knowledge Avenue, Education District,<br />Kochi, Kerala 682001</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="bg-gray-800 p-2 rounded text-gray-300 shrink-0"><Phone size={16} /></span>
                <span className="hover:text-yellow-400 cursor-pointer transition-colors">+91 484 234 5678</span>
              </p>
              <p className="flex items-center gap-3 break-all sm:break-normal">
                <span className="bg-gray-800 p-2 rounded text-gray-300 shrink-0"><Mail size={16} /></span>
                <span className="hover:text-yellow-400 cursor-pointer transition-colors">ansillibrary@education.org</span>
              </p>
              <div className="pt-4 border-t border-gray-800 mt-4">
                <p className="font-bold text-white">Chief Librarian:</p>
                <p className="text-yellow-500 font-medium">Mr. Ansil K. Rahman</p>
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
                <span className="text-white font-semibold">Dr. Sarah Thomas</span>
                <span className="text-yellow-500 text-xs">President</span>
              </li>
              <li className="flex flex-col bg-gray-800/50 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="text-white font-semibold">Prof. Rahul Nair</span>
                <span className="text-yellow-500 text-xs">Secretary</span>
              </li>
              <li className="flex flex-col bg-gray-800/50 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="text-white font-semibold">Mrs. Priya Rajan</span>
                <span className="text-yellow-500 text-xs">Treasurer</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>&copy; {new Date().getFullYear()} Ansil's Library. All rights reserved.</p>
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
