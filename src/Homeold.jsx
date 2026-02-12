import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white p-6 md:p-10 font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-12">
        <div className="text-lg font-bold tracking-widest">THE LAB / ALPHA</div>
      </nav>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto auto-rows-[200px]">
        
        {/* Main Hero - Large Feature */}
        <div className="md:col-span-8 md:row-span-2 bg-[#111] rounded-[2rem] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group">
          <h1 className="text-5xl md:text-7xl font-bold uppercase leading-none mb-6">
            Time <br /> <span className="text-zinc-700 group-hover:text-zinc-500 transition-colors">Redefined.</span>
          </h1>
          <p className="text-zinc-500 max-w-sm text-lg mb-8">
            Experience the fusion of precision engineering and digital artistry.
          </p>
        </div>

        {/* Watch Section - Small Box */}
        <Link to="/watch" className="md:col-span-4 md:row-span-1 bg-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-zinc-800 transition-colors border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-500">01</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">→</div>
          </div>
          <h3 className="text-2xl font-semibold">Watch Series</h3>
        </Link>

        {/* Shoe Section - Small Box */}
        <Link to="/shoe" className="md:col-span-4 md:row-span-1 bg-zinc-900 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-zinc-800 transition-colors border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-zinc-500">02</span>
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">→</div>
          </div>
          <h3 className="text-2xl font-semibold">The Shoe</h3>
        </Link>

        {/* About Me - Tall Box 
        <div className="md:col-span-4 md:row-span-2 bg-zinc-900 rounded-[2rem] p-8 flex flex-col justify-end border border-white/5 relative group">
          <div className="absolute top-8 left-8 text-zinc-700 text-5xl font-bold opacity-20 uppercase">About</div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Designer & Dev</h3>
            <p className="text-zinc-500 text-sm">Building digital artifacts that push the boundaries of the web.</p>
          </div>
        </div>
            */}
        {/* Coming Soon 1 */}
        <div className="md:col-span-4 md:row-span-1 bg-[#111] rounded-[2rem] p-8 flex items-center justify-center border border-dashed border-white/10">
          <span className="text-zinc-600 uppercase tracking-widest text-sm animate-pulse">Coming Soon</span>
        </div>

        {/* Work With Me - Wide Box 
        <div className="md:col-span-4 md:row-span-1 bg-white text-black rounded-[2rem] p-8 flex flex-col justify-between group cursor-pointer">
          <h3 className="text-2xl font-bold leading-tight">Have a project <br/> in mind?</h3>
          <p className="font-bold underline">Let's Talk</p>
        </div>*/}

        {/* Coming Soon 2 */}
        <div className="md:col-span-8 md:row-span-1 bg-[#111] rounded-[2rem] p-8 flex items-center justify-center border border-dashed border-white/10">
          <span className="text-zinc-600 uppercase tracking-widest text-sm italic">New Experiment Dropping Q3</span>
        </div>

      </div>
    </div>
  )
}