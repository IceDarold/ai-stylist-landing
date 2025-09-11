import React from 'react';
import { GlassCard } from './GlassCard';

const benefits = [
  {
    title: 'Save 10+ Hours Weekly',
    description:
      'Stop endless scrolling. Our AI delivers perfect outfits in seconds, giving you back your most valuable asset: your time.',
  },
  {
    title: 'Perfect Fit, Guaranteed',
    description:
      'We analyze data from thousands of customer reviews and photos to recommend sizes that actually fit, reducing returns and frustration.',
  },
  {
    title: 'Unlock Your Style',
    description:
      'Discover curated capsules and endless outfit combinations you would have never thought of, perfectly tailored to your taste and budget.',
  },
  {
    title: 'Shop Smarter, Not Harder',
    description:
      "One platform to discover and shop looks from hundreds of stores. We aggregate the best options so you don't have to.",
  },
];

export const ValueProposition: React.FC = () => {
  return (
    <section className="py-24 bg-gray-900/50">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="font-poppins text-4xl font-bold mb-2">Why You'll Love It</h2>
          <p className="text-gray-400">The future of personal styling is here.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <GlassCard key={index} className="p-8 !rounded-xl">
              <h3 className="font-poppins text-2xl font-semibold mb-3 text-green-300">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

