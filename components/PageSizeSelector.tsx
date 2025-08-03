
import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../constants';
import type { PageSize } from '../types';

interface PageSizeSelectorProps {
  onSelect: (size: PageSize) => void;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 animate-[fade-in_0.5s_ease-in-out]">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-cyan-400 font-bangers">Step 1: Choose Your Page Size</h2>
        <p className="text-lg text-gray-400 mt-2">Select a standard format for your page.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
        {PAGE_SIZE_OPTIONS.map(size => (
          <button
            key={size.name}
            onClick={() => onSelect(size)}
            className="group w-full max-w-[220px] flex flex-col items-center text-center p-4 bg-gray-800 border-2 border-gray-700 rounded-2xl hover:bg-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-cyan-500/30"
          >
            <div
              className="w-full bg-gray-900/50 rounded-md mb-4 border border-gray-600 group-hover:border-cyan-600 transition-colors"
              style={{
                aspectRatio: `${size.width} / ${size.height}`,
                backgroundImage: size.backgroundImage ? `url(${size.backgroundImage})` : undefined,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">{size.name}</h3>
            <p className="font-bangers text-lg text-gray-400 group-hover:text-cyan-400 transition-colors">{size.subtitle}</p>
            <p className="text-xs text-gray-500 mt-1">{size.width} &times; {size.height} px</p>
          </button>
        ))}
      </div>
    </div>
  );
};
