
import React from 'react';
import { WifiIcon, CellularIcon, BatteryIcon, MenuIcon } from '../constants/icons';

export const PhoneMockup: React.FC = () => {
  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[10px] rounded-[2.5rem] h-[812px] w-[385px] shadow-2xl">
      <div className="w-[140px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[13px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[13px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[13px] top-[142px] rounded-e-lg"></div>
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-gray-900">
        <div className="w-full h-full text-white p-5 flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <CellularIcon className="w-4 h-4" />
              <WifiIcon className="w-4 h-4" />
              <BatteryIcon className="w-6 h-6" />
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mt-4">
            <h2 className="font-bold text-lg">AirWatch®</h2>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-300">
              <span>Menu</span>
              <MenuIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col justify-center items-center text-center -mt-8">
             <h1 className="font-playfair text-4xl leading-tight">Climate<br/>Control Monitor</h1>
             
             <div className="my-6 w-full aspect-square bg-black/30 rounded-3xl p-2 border border-white/10">
                <img 
                    src="https://picsum.photos/seed/starbloom/400/400" 
                    alt="Starbloom visualization" 
                    className="rounded-2xl object-cover w-full h-full" 
                />
             </div>

             <div>
                <h3 className="text-2xl font-semibold">Starbloom</h3>
                <p className="text-gray-400">Flos lunae</p>
             </div>
          </div>
          
          {/* Footer Text */}
          <div className="text-center text-xs text-gray-500 pb-2">
            <p>Real-time data for a healthier home.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
