
import React from 'react';

const windData = [4, 6, 3, 8, 4, 10, 5, 3, 9, 6, 7, 10, 4, 3, 6, 8, 5, 9];

export const WindChart: React.FC = () => {
  return (
    <div className="flex items-end justify-between h-16 w-full space-x-1">
      {windData.map((height, index) => (
        <div
          key={index}
          className="w-2 bg-white/50 rounded-full"
          style={{ height: `${height * 10}%` }}
        ></div>
      ))}
    </div>
  );
};
