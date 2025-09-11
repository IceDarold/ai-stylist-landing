
import React from 'react';
import { GlassCard } from './GlassCard';

const similarItems = [
  {
    id: 1,
    imageUrl: 'https://i.imgur.com/u4l9hG1.jpeg',
    name: 'Iva™ Trendy Regen Jacket'
  },
  {
    id: 2,
    imageUrl: 'https://i.imgur.com/VCIrF68.jpeg',
    name: 'Colorblock Zip Jacket'
  },
  {
    id: 3,
    imageUrl: 'https://i.imgur.com/n1hBq1b.jpeg',
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
                <div className="flex-1">
                    {/* Empty div for layout, can add item name here if needed */}
                </div>
                <div className="w-16 h-16 bg-cover rounded-md" style={{backgroundImage: `url(${item.imageUrl})`, backgroundPosition: 'right'}}></div>
            </div>
        </GlassCard>
      ))}
    </div>
  );
};
