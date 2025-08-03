
import React, { useState, useMemo, useEffect } from 'react';
import type { ComicLayout, PageSize } from '../types';
import { LAYOUT_CONFIGS, PAGE_GRID_COLS, PAGE_GRID_ROWS } from '../templates';

interface LayoutEditorProps {
  panelCount: number;
  pageSize: PageSize;
  onConfirm: (layout: ComicLayout) => void;
  onBack: () => void;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({ panelCount, pageSize, onConfirm, onBack }) => {
  const config = useMemo(() => LAYOUT_CONFIGS[panelCount], [panelCount]);
  
  const [dividerValues, setDividerValues] = useState<{[key: string]: number}>(() => {
    if (!config) return {};
    return config.dividers.reduce((acc, divider) => {
        acc[divider.id] = divider.initialValue;
        return acc;
    }, {} as {[key: string]: number});
  });
  
  const [optionValues, setOptionValues] = useState<{ [key: string]: string }>({});

  // Handle case where panelCount might not have a config (though it should)
  useEffect(() => {
    if (config) {
      setDividerValues(config.dividers.reduce((acc, divider) => {
          acc[divider.id] = divider.initialValue;
          return acc;
      }, {} as {[key: string]: number}));
      
      const initialOptions = config.options?.reduce((acc, option) => {
          acc[option.id] = option.defaultValue;
          return acc;
      }, {} as {[key: string]: string}) || {};
      setOptionValues(initialOptions);
    }
  }, [config]);


  const currentLayout = useMemo(() => {
    if (!config) return [];
    const staticLayout = config.generateLayout(dividerValues, optionValues);
    // Ensure the generated layout has the static property required by downstream components
    return staticLayout.map(p => ({...p, static: true, minW: 2, minH: 2}));
  }, [config, dividerValues, optionValues]);

  const handleSliderChange = (id: string, value: number) => {
    setDividerValues(prev => ({ ...prev, [id]: value }));
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptionValues(prev => ({ ...prev, [id]: value }));
  };
  
  if (!config) {
    return (
        <div className="w-full max-w-4xl mx-auto p-8 text-center">
            <h2 className="text-3xl font-bold text-red-500">Configuration Error</h2>
            <p className="text-lg text-gray-400 mt-4">Sorry, a customizable layout for {panelCount} panels is not available.</p>
            <button onClick={onBack} className="mt-8 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500">Go Back</button>
        </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-8 animate-[fade-in_0.5s_ease-in-out]">
        {/* Left Side: Controls */}
        <div className="lg:w-[450px] w-full flex-shrink-0 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
            <h2 className="text-4xl font-black text-cyan-400 mb-2 font-bangers">Create Custom Layout</h2>
            <p className="text-gray-400 mb-6">Adjust the sliders to change the panel proportions. The layout is always gap-free.</p>

            <div className="space-y-6">
                {config.dividers.map(divider => {
                  const dependentMin = divider.minId ? dividerValues[divider.minId] + 2 : divider.min;
                  const dependentMax = divider.maxId ? dividerValues[divider.maxId] - 2 : divider.max;
                  const currentValue = dividerValues[divider.id];

                  // Clamp value if dependencies changed
                  const clampedValue = Math.max(dependentMin, Math.min(currentValue, dependentMax));
                  if (clampedValue !== currentValue) {
                    handleSliderChange(divider.id, clampedValue);
                  }
                  
                  return (
                    <div key={divider.id}>
                        <label className="block text-sm font-bold text-gray-300 mb-1">{divider.label} ({Math.round((currentValue / (divider.orientation === 'horizontal' ? PAGE_GRID_ROWS : PAGE_GRID_COLS)) * 100)}%)</label>
                        <input
                            type="range"
                            min={dependentMin}
                            max={dependentMax}
                            value={clampedValue}
                            onChange={(e) => handleSliderChange(divider.id, parseInt(e.target.value, 10))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                );
              })}
            </div>

            {config.options && config.options.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                    {config.options.map(option => (
                        <div key={option.id}>
                            <label className="block text-sm font-bold text-gray-300 mb-2">{option.label}</label>
                            <div className="flex flex-wrap gap-2">
                                {option.choices.map(choice => (
                                    <button
                                        key={choice.value}
                                        onClick={() => handleOptionChange(option.id, choice.value)}
                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 font-semibold text-white ${optionValues[option.id] === choice.value ? 'bg-cyan-600 ring-2 ring-cyan-400' : 'bg-gray-600 hover:bg-gray-500'}`}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                <button onClick={onBack} className="px-6 py-3 w-full sm:w-auto rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-lg">Back</button>
                <button onClick={() => onConfirm(currentLayout)} className="px-6 py-3 w-full sm:flex-1 rounded-md bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-lg hover:shadow-cyan-500/30">Confirm Layout</button>
            </div>
        </div>

        {/* Right Side: Preview */}
        <div className="lg:w-auto w-full flex-1">
            <div className="w-full lg:sticky top-28 flex justify-center items-start">
                 <div
                    className="bg-gray-800 border-2 border-gray-700 rounded-lg p-2 w-full max-w-[600px]"
                    style={{ aspectRatio: `${pageSize.width} / ${pageSize.height}` }}
                  >
                    <div
                      className="w-full h-full grid bg-gray-900/50 rounded-sm"
                      style={{
                          gridTemplateColumns: `repeat(${PAGE_GRID_COLS}, 1fr)`,
                          gridTemplateRows: `repeat(${PAGE_GRID_ROWS}, 1fr)`,
                          gap: '4px',
                      }}
                    >
                      {currentLayout.map((item, panelIndex) => (
                        <div
                          key={item.i}
                          className="bg-gray-700 rounded-sm flex items-center justify-center transition-all duration-100 ease-linear"
                          style={{
                            gridColumn: `${item.x + 1} / span ${item.w}`,
                            gridRow: `${item.y + 1} / span ${item.h}`,
                          }}
                        >
                          <span className="text-3xl font-black text-gray-500">{panelIndex + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
            </div>
        </div>
    </div>
  );
};
