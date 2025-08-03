
import React from 'react';

interface PanelCountSelectorProps {
  onSelect: (count: number) => void;
  onBack: () => void;
}

const panelOptions = [2, 3, 4, 5, 6, 8];

export const PanelCountSelector: React.FC<PanelCountSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 animate-[fade-in_0.5s_ease-in-out]">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-cyan-400 font-bangers">Step 2: How many panels?</h2>
        <p className="text-lg text-gray-400 mt-2">Choose the number of panels for your comic page.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {panelOptions.map(count => (
          <button
            key={count}
            onClick={() => onSelect(count)}
            className="group aspect-square flex flex-col justify-center items-center bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 hover:bg-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-cyan-500/30"
          >
            <span className="text-8xl font-black text-gray-500 group-hover:text-white transition-colors duration-300">{count}</span>
            <span className="text-2xl font-bangers text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 mt-2">
              {count === 1 ? 'Panel' : 'Panels'}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-12 flex justify-start">
            <button
                onClick={onBack}
                className="px-8 py-3 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-lg"
            >
                Back
            </button>
        </div>
    </div>
  );
};
