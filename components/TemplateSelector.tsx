
import React from 'react';
import { TEMPLATES } from '../templates';
import type { ComicLayout, PageSize } from '../types';

interface TemplateSelectorProps {
  panelCount: number;
  pageSize: PageSize;
  onSelect: (layout: ComicLayout) => void;
  onBack: () => void;
  onSelectCustom: () => void;
}

const PAGE_GRID_COLS = 12;
const PAGE_GRID_ROWS = 17;
const PREVIEW_WIDTH = 200; // width in pixels for each preview card

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ panelCount, pageSize, onSelect, onBack, onSelectCustom }) => {
  const templatesForCount = TEMPLATES[panelCount] || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 animate-[fade-in_0.5s_ease-in-out]">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-cyan-400 font-bangers">Step 3: Choose a Template</h2>
        <p className="text-lg text-gray-400 mt-2">Select a preset layout for a {panelCount}-panel page, or create your own.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {/* Custom Template Card */}
        <div 
            className="flex flex-col items-center cursor-pointer group w-full"
            style={{ maxWidth: `${PREVIEW_WIDTH}px` }}
            onClick={onSelectCustom}
          >
            <div
              className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-2 group-hover:border-cyan-500 transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg group-hover:shadow-cyan-500/20 w-full flex justify-center items-center"
              style={{ 
                  aspectRatio: `${pageSize.width} / ${pageSize.height}`,
              }}
            >
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  <path d="M21 12.792V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7.792" />
                </svg>
                 <span className="text-lg font-black text-gray-500 group-hover:text-cyan-400 transition-colors mt-2 block">Create Layout</span>
              </div>
            </div>
            <span className="mt-4 text-xl font-bold text-gray-400 font-bangers tracking-wider group-hover:text-white transition-colors">Create Your Own</span>
          </div>

        {/* Pre-made Template Cards */}
        {templatesForCount.map((layout, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center cursor-pointer group w-full"
            style={{ maxWidth: `${PREVIEW_WIDTH}px` }}
            onClick={() => onSelect(layout)}
          >
            <div
              className="bg-gray-800 border-2 border-gray-700 rounded-lg p-2 group-hover:border-cyan-500 transition-all duration-300 transform group-hover:-translate-y-1 shadow-lg group-hover:shadow-cyan-500/20 w-full"
              style={{ 
                  aspectRatio: `${pageSize.width} / ${pageSize.height}`,
              }}
            >
              <div
                className="w-full h-full grid bg-gray-900/50 rounded-sm"
                style={{
                    gridTemplateColumns: `repeat(${PAGE_GRID_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${PAGE_GRID_ROWS}, 1fr)`,
                    gap: '4px',
                }}
              >
                {layout.map((item, panelIndex) => (
                  <div
                    key={item.i}
                    className="bg-gray-700 rounded-sm flex items-center justify-center group-hover:bg-gray-600 transition-colors"
                    style={{
                      gridColumn: `${item.x + 1} / span ${item.w}`,
                      gridRow: `${item.y + 1} / span ${item.h}`,
                    }}
                  >
                    <span className="text-lg font-black text-gray-500 group-hover:text-cyan-400 transition-colors">{panelIndex + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <span className="mt-4 text-xl font-bold text-gray-400 font-bangers tracking-wider group-hover:text-white transition-colors">Template {index + 1}</span>
          </div>
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
