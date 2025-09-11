"use client";
import React from "react";
import { GlassCard } from "./components/GlassCard";
import { ShoppingCartIcon, ArrowDown } from "./constants/icons";
import { ActionPanel } from "./components/ActionPanel";
import { SimilarItems } from "./components/SimilarItems";
import { HowItWorks } from "./components/HowItWorks";
import { LiveDemo } from "./components/LiveDemo";
import { ValueProposition } from "./components/ValueProposition";
import { EFooter } from "./components/Footer";

export default function ExperimentalV1Page() {
  const tshirtImages = [
    "/experimental/v1/tshirt.svg",
    "/experimental/v1/tshirt-2.svg",
    "/experimental/v1/tshirt-3.svg",
    "/experimental/v1/tshirt-4.svg",
  ];
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [prevIdx, setPrevIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    const TRANSITION_MS = 800;
    const id = setInterval(() => {
      setActiveIdx((i) => {
        setPrevIdx(i);
        // Clear prev after transition completes
        setTimeout(() => setPrevIdx(null), TRANSITION_MS);
        return (i + 1) % tshirtImages.length;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [tshirtImages.length]);

  return (
    <div className="bg-gray-900 text-white">
      <main className="relative h-screen w-screen overflow-hidden font-light">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/experimental/v1/bg.svg)`,
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
          {tshirtImages.map((src, i) => {
            const isActive = i === activeIdx;
            const isPrev = i === prevIdx;
            return (
              <img
                key={src}
                src={src}
                alt="T-shirt"
                className={`absolute inset-0 w-full h-full object-contain ${
                  isActive ? "tshirt-enter" : isPrev ? "tshirt-exit" : "opacity-0"
                }`}
                style={{ zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
                aria-hidden={!isActive}
              />
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-80">
          <ActionPanel />
          <SimilarItems />
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="uppercase tracking-[0.5em] text-gray-400 text-sm">Discover the new you</p>
      </footer>

      {/* Scroll-down indicator */}
      <a href="#how-it-works" className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-label="Scroll to How It Works">
        <ArrowDown className="w-7 h-7 text-white/60" />
      </a>

      <style>{`
        .font-poppins { font-family: 'Poppins', sans-serif; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        /* Incoming image */
        @keyframes tshirt-enter {
          0% { opacity: 0; transform: translateX(40%) rotate(10deg) scale(0.96); }
          100% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
        }
        /* Outgoing image */
        @keyframes tshirt-exit {
          0% { opacity: 1; transform: translateX(0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translateX(-40%) rotate(-10deg) scale(0.96); }
        }
        .tshirt-enter {
          animation: tshirt-enter 800ms cubic-bezier(.2,.8,.2,1) both, float 6s ease-in-out infinite 800ms;
        }
        .tshirt-exit { animation: tshirt-exit 800ms cubic-bezier(.2,.8,.2,1) both; }
      `}</style>
      </main>

      {/* Sections after hero */}
      <HowItWorks />
      <LiveDemo />
      <ValueProposition />
      <EFooter />
    </div>
  );
}
