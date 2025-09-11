import React from 'react';
import { GlassCard } from './GlassCard';
import { UserCircle, Sparkles, ShoppingBag } from '../constants/icons';

const steps = [
    {
        icon: UserCircle,
        title: 'Set Your Profile',
        description: 'Upload a photo or enter your parameters (height, weight, style preferences). Your profile is saved for a personalized experience every time.'
    },
    {
        icon: Sparkles,
        title: 'AI-Powered Curation',
        description: 'Our AI stylist analyzes your data and scours thousands of products to find the perfect items for you, considering fit, quality, and budget.'
    },
    {
        icon: ShoppingBag,
        title: 'Shop Your Look',
        description: 'Receive complete, ready-to-wear outfits. Mix and match items, or buy a curated look directly from our partner stores.'
    }
];

export const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-24 bg-gray-900/50">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="font-poppins text-4xl font-bold mb-2">How It Works</h2>
                    <p className="text-gray-400">Your personalized style journey in three simple steps.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <GlassCard key={index} className="p-8 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                                    <step.icon className="w-8 h-8 text-green-300" />
                                </div>
                            </div>
                            <h3 className="font-poppins text-xl font-semibold mb-2">{`Step ${index+1}: ${step.title}`}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}