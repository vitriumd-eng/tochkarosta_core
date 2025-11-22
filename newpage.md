import React from 'react';
import { ArrowRight, Plus, Menu, X } from 'lucide-react';

const Navbar = () => (
  <nav className="flex justify-between items-center py-6 px-6 max-w-7xl mx-auto">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white">
        <Plus size={16} />
      </div>
      <span className="font-bold text-lg tracking-tight text-gray-900">BloomFi</span>
    </div>
    
    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
      <a href="#" className="text-gray-900">USDBloom</a>
      <a href="#" className="hover:text-gray-900 transition">Business</a>
      <a href="#" className="hover:text-gray-900 transition">Treasury</a>
      <a href="#" className="hover:text-gray-900 transition">Developers</a>
      <a href="#" className="hover:text-gray-900 transition">Join us</a>
    </div>

    <button className="bg-[#1F1D2B] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-opacity-90 transition">
      Launch App
    </button>
  </nav>
);

const Hero = () => (
  <div className="px-4 md:px-6 max-w-7xl mx-auto mb-20">
    <div className="relative w-full rounded-[2.5rem] overflow-hidden h-[500px] md:h-[600px]">
      {/* Background Image Simulation */}
      <img 
        src="https://images.unsplash.com/photo-1634117622592-114e3024ff27?q=80&w=2525&auto=format&fit=crop" 
        alt="Hero 3D Landscape" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-20 md:pt-28 text-center px-4">
        <Plus className="mb-4 text-gray-800" size={24} strokeWidth={3} />
        <h1 className="text-4xl md:text-6xl font-medium text-[#1F1D2B] mb-6 tracking-tight">
          Where Money Grows
        </h1>
        <p className="text-gray-600 max-w-md mb-8 text-sm md:text-base leading-relaxed">
          A programmable, utility-driven stable token designed for native value accrual and seamless integration into DeFi.
        </p>
        <button className="bg-[#1F1D2B] text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition duration-300">
          Try it now
        </button>
      </div>
    </div>
  </div>
);

const InfoSection = () => (
  <div className="px-6 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    <div>
      <h2 className="text-3xl md:text-4xl font-medium text-[#1F1D2B] mb-6">
        What is USD Bloom?
      </h2>
      <button className="bg-[#2A2838] text-white px-6 py-2.5 rounded-full text-sm flex items-center gap-2 hover:bg-opacity-90 transition">
        Explore new
      </button>
    </div>
    <p className="text-gray-500 max-w-sm text-lg leading-relaxed md:text-right">
      USD Bloom is a yield-bearing stablecoin that helps your capital grow while staying pegged to the U.S. dollar.
    </p>
  </div>
);

const Features = () => (
  <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
    {/* Large Card */}
    <div className="md:col-span-6 lg:col-span-7 bg-gradient-to-br from-[#Dbeafe] to-[#E0E7FF] rounded-[2rem] p-8 md:p-10 min-h-[320px] relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-2xl font-medium text-[#1F1D2B] mb-4">Capital that grows</h3>
        <p className="text-gray-600 text-sm max-w-xs mt-20 md:mt-32">
          Earn passive income as your stablecoins are deployed into high-performing DeFi protocols.
        </p>
      </div>
      <img 
        src="https://images.unsplash.com/photo-1680284780958-240735c6d42b?q=80&w=1000&auto=format&fit=crop"
        className="absolute bottom-[-20%] right-[-10%] w-64 h-64 object-cover opacity-90 mix-blend-multiply rounded-full rotate-12 group-hover:scale-110 transition duration-500"
        alt="Flower 3D"
      />
    </div>

    {/* Dark Card 1 */}
    <div className="md:col-span-6 lg:col-span-5 md:row-span-2 flex flex-col gap-6">
        <div className="bg-[#1F1D2B] rounded-[2rem] p-8 md:p-10 min-h-[280px] flex flex-col justify-between hover:bg-[#2a2838] transition duration-300">
            <div>
                <h3 className="text-2xl font-medium text-white mb-2">Always liquid,<br />always stable</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
                Stay fully dollar-pegged with instant access to your funds — no lockups or delays.
            </p>
        </div>

        {/* Dark Card 2 */}
        <div className="bg-[#1F1D2B] rounded-[2rem] p-8 md:p-10 min-h-[280px] flex flex-col justify-between hover:bg-[#2a2838] transition duration-300">
            <div>
                <h3 className="text-2xl font-medium text-white mb-2">100%<br />hands-free</h3>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
                No need to manage strategies manually. USD Bloom works in the background for you.
            </p>
        </div>
    </div>
  </div>
);

const Logos = () => (
  <div className="px-6 max-w-7xl mx-auto mb-24 border-t border-gray-100 pt-12">
    <p className="text-xs text-gray-400 mb-6">Backed by the best companies and visionary angels.</p>
    <div className="flex flex-wrap gap-8 md:gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
      {/* Mock Logos using text for simplicity as specific SVGs aren't available */}
      <span className="font-bold text-xl">Founders Lab</span>
      <span className="font-bold text-xl">KUCOIN</span>
      <span className="font-bold text-xl">NGC</span>
      <span className="font-bold text-xl">NexGen</span>
      <span className="font-bold text-xl">MakerDao</span>
      <span className="font-bold text-xl">DEXTools</span>
    </div>
  </div>
);

const UseCases = () => (
  <div className="px-6 max-w-7xl mx-auto mb-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Left Text Content */}
      <div className="pt-10">
        <p className="text-sm text-gray-500 mb-2">USD Bloom in Action</p>
        <h2 className="text-4xl md:text-5xl font-medium text-[#1F1D2B] mb-8">Use cases</h2>
        <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
          USD Bloom offers a variety of use cases for developers, businesses and treasuries seeking secure and profitable stablecoin integrations.
        </p>
      </div>

      {/* Right Card - Business */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-100/50 relative overflow-hidden min-h-[500px]">
        <div className="relative z-10">
          <h3 className="text-3xl font-medium text-[#1F1D2B] mb-4">Business</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-md">
            Boost user engagement by offering USD Bloom, a secure flat-backed stablecoin with high yields, allowing your customers to earn effortlessly on your platform.
          </p>
          <button className="text-[#1F1D2B] font-medium flex items-center gap-2 text-sm group">
            Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>
        </div>
        
        {/* 3D Bank Illustration Simulation */}
        <div className="absolute bottom-0 left-0 w-full h-64 flex justify-center items-end">
             <img 
                src="https://images.unsplash.com/photo-1642534269966-e5b57539d594?q=80&w=1000&auto=format&fit=crop" 
                alt="3D Bank"
                className="w-full h-full object-contain object-bottom opacity-90"
             />
        </div>
      </div>

    </div>
  </div>
);

const Footer = () => (
    <div className="py-12 px-6 text-center text-gray-300 text-sm">
        <p>© 2024 BloomFi Clone. Design concept reproduction.</p>
    </div>
)

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-indigo-100">
      <Navbar />
      <Hero />
      <InfoSection />
      <Features />
      <Logos />
      <UseCases />
      <Footer />
    </div>
  );
}