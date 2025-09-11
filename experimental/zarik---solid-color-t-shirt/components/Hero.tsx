import React from 'react';
import { GlassCard } from './GlassCard';
import { ShoppingCartIcon, ArrowDown } from '../constants/icons';
import { ActionPanel } from './ActionPanel';
import { SimilarItems } from './SimilarItems';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden font-light">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://i.imgur.com/Is3dSQL.jpeg)`,
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
        <div className="flex items-center space-x-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white text-black font-bold text-xl flex items-center justify-center rounded-full mr-2">N</div>
            <span className="font-poppins font-bold text-2xl tracking-wider">ZARIK</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest text-gray-300">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Shop</a>
            <a href="#" className="hover:text-white">New</a>
            <a href="#" className="hover:text-white">Premium</a>
            <a href="#" className="hover:text-white">More</a>
          </nav>
        </div>
        <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-2 px-4 text-sm hover:bg-white/20 transition-colors">
          <span>ADD TO CART</span>
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Left Info */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 space-y-8 w-80">
          <div>
            <p className="text-gray-300">premium mens</p>
            <h1 className="font-poppins text-6xl font-bold tracking-tight leading-none">SOLID<br/>COLOR<br/>T-SHIRT</h1>
          </div>
          <GlassCard className="text-xs p-4 leading-relaxed text-gray-300 !rounded-xl !scale-100">
            <ul className="space-y-1">
              <li>PREMIUM COMFORT</li>
              <li>MINIMALIST STYLE</li>
              <li>ECO CONSCIOUS</li>
              <li>SMOOTH ON THE SKIN</li>
              <li>PERFECT FOR EVERYDAY WEAR</li>
              <li>ORGANIC COTTON</li>
              <li>BREATHABLE FABRIC</li>
            </ul>
          </GlassCard>
           <GlassCard className="p-4 !rounded-xl !scale-100">
              <h3 className="font-poppins text-lg font-bold">MOST<span className="font-light">look</span></h3>
              <p className="font-poppins text-3xl font-bold text-green-300">CLASSY</p>
          </GlassCard>
        </div>
        
        {/* Center T-Shirt */}
        <div className="relative w-[600px] h-[700px]">
          <img src="https://i.imgur.com/5hGXYiW.png" alt="Green T-shirt" className="absolute inset-0 w-full h-full object-contain animate-float" />
        </div>
        
        {/* Right Panel */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-80">
          <ActionPanel />
          <SimilarItems />
        </div>
      </div>
      
      {/* Scroll Down Arrow */}
       <a href="#how-it-works" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ArrowDown className="w-8 h-8 text-white/50" />
      </a>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
