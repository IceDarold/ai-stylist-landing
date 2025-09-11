import React from 'react';
import { GlassCard } from './GlassCard';

const occasions = ['Date Night', 'Office', 'Party', 'Casual'];

const outfits = [
    {
        name: 'Urban Explorer',
        image: 'https://i.imgur.com/tLh7aH2.jpeg',
        items: ['Leather Jacket', 'Graphic Tee', 'Dark Wash Jeans', 'White Sneakers'],
        price: 349.99
    },
    {
        name: 'Business Casual',
        image: 'https://i.imgur.com/sC5I5aA.jpeg',
        items: ['Navy Blazer', 'White Dress Shirt', 'Khaki Chinos', 'Brown Loafers'],
        price: 425.50
    },
    {
        name: 'Weekend Vibes',
        image: 'https://i.imgur.com/pGakzfc.jpeg',
        items: ['Linen Shirt', 'Denim Shorts', 'Canvas Espadrilles', 'Sunglasses'],
        price: 210.00
    }
];

export const LiveDemo: React.FC = () => {
    const [activeOccasion, setActiveOccasion] = React.useState('Date Night');
    return (
        <section className="py-24">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="font-poppins text-4xl font-bold mb-2">Live Demo</h2>
                    <p className="text-gray-400">See your AI stylist in action. Select an occasion to get started.</p>
                </div>

                <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
                    {occasions.map(occasion => (
                        <button 
                            key={occasion}
                            onClick={() => setActiveOccasion(occasion)}
                            className={`px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-full transition-colors font-semibold ${activeOccasion === occasion ? 'bg-green-400 text-gray-900' : 'bg-white/10 hover:bg-white/20'}`}>
                            {occasion}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {outfits.map((outfit, index) => (
                        <GlassCard key={index} className="p-4 overflow-hidden !rounded-xl">
                            <img src={outfit.image} alt={outfit.name} className="w-full h-80 object-cover rounded-lg mb-4" />
                            <h3 className="font-poppins text-xl font-semibold mb-2">{outfit.name}</h3>
                            <p className="text-sm text-gray-300 mb-4">{outfit.items.join(' • ')}</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-green-300">${outfit.price.toFixed(2)}</span>
                                <button className="bg-white text-black font-bold py-2 px-4 rounded-md text-sm hover:bg-gray-200 transition-colors">
                                    Shop Look
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};