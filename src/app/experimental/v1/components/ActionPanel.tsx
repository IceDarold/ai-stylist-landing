import React from 'react';
import { GlassCard } from './GlassCard';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../constants/icons';

const sizes = ['M', 'L', 'XL', 'XXL'];

export const ActionPanel: React.FC = () => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedSize, setSelectedSize] = React.useState('L');

  return (
    <GlassCard className="p-4 text-white w-full max-w-xs">
      <div className="text-xs mb-2 text-gray-300">T-Shirt Size</div>
      <div className="flex justify-between mb-4">
        {sizes.map(size => (
          <button 
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`w-10 h-10 rounded-md border transition-colors ${selectedSize === size ? 'bg-white text-black border-white' : 'border-white/20 hover:bg-white/10'}`}
          >
            {size}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center border border-white/20 rounded-md">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10">-</button>
          <span className="w-10 text-center">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10">+</button>
        </div>
        <button className="bg-white text-black font-bold py-2 px-4 rounded-md h-10 hover:bg-gray-200 transition-colors">
          ADD TO BASKET
        </button>
      </div>

      <button className="w-full bg-transparent border border-white/20 text-white font-bold py-2 px-4 rounded-md mb-4 hover:bg-white/10 transition-colors">
        BUY NOW
      </button>

      <div className="flex justify-center space-x-4 text-gray-400">
        <FacebookIcon className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        <InstagramIcon className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        <TwitterIcon className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
      </div>
    </GlassCard>
  );
};

