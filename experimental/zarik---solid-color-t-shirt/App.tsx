import React from 'react';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LiveDemo } from './components/LiveDemo';
import { ValueProposition } from './components/ValueProposition';
import { Footer } from './components/Footer';


const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white">
      <Hero />
      <main>
        <HowItWorks />
        <LiveDemo />
        <ValueProposition />
      </main>
      <Footer />
    </div>
  );
};

export default App;