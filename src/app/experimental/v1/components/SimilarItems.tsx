import React from 'react';
import { GlassCard } from './GlassCard';

const similarItems = [
  {
    id: 1,
    imageUrl: '/experimental/v1/item1.svg',
    name: 'Iva™ Trendy Regen Jacket'
  },
  {
    id: 2,
    imageUrl: '/experimental/v1/item2.svg',
    name: 'Colorblock Zip Jacket'
  },
  {
    id: 3,
    imageUrl: '/experimental/v1/item3.svg',
    name: 'Hooded Windbreaker'
  }
];

export const SimilarItems: React.FC = () => {
  return (
    <div className="space-y-2 mt-4">
      {similarItems.map(item => (
        <GlassCard key={item.id} className="p-2 !rounded-xl hover:!scale-100">
            <div className="flex items-center space-x-3">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1" />
                <div className="w-16 h-16 bg-cover rounded-md" style={{backgroundImage: `url(${item.imageUrl})`, backgroundPosition: 'right'}}></div>
            </div>
        </GlassCard>
      ))}
    </div>
  );
};
