
import React, { useState, useEffect, useRef, SetStateAction, Dispatch } from 'react';
import { toPng, toJpeg, toCanvas } from 'html-to-image';
import type { ComicLayout, PanelData, UploadedImage, TextProperties, PageSettings, PanelStyle, PageSize } from '../types';
import { FONT_OPTIONS } from '../constants';

interface ComicPageEditorProps {
    comicLayout: ComicLayout;
    pageSize: PageSize;
    initialImages: UploadedImage[];
    onReset: () => void;
    onChangeTemplate: () => void;
    pageSettings: PageSettings;
    onPageSettingsChange: Dispatch<SetStateAction<PageSettings>>;
    panelStyle: PanelStyle;
    onPanelStyleChange: Dispatch<SetStateAction<PanelStyle>>;
    titleProps: TextProperties;
    onTitlePropsChange: Dispatch<SetStateAction<TextProperties>>;
    pageNumberProps: TextProperties;
    onPageNumberPropsChange: Dispatch<SetStateAction<TextProperties>>;
}

const PAGE_GRID_COLS = 12;
const PAGE_GRID_ROWS = 17;


export const ComicPageEditor: React.FC<ComicPageEditorProps> = ({
    comicLayout,
    pageSize, 
    initialImages, 
    onReset,
    onChangeTemplate,
    pageSettings,
    onPageSettingsChange,
    panelStyle,
    onPanelStyleChange,
    titleProps,
    onTitlePropsChange,
    pageNumberProps,
    onPageNumberPropsChange,
}) => {
    const comicPageRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // For changing single images
    const [panels, setPanels] = useState<PanelData[]>([]);
    const [panelIdToUpdate, setPanelIdToUpdate] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportFilename, setExportFilename] = useState<string>('framing-book-page');
    
    // State for new features
    const [expandedPanelId, setExpandedPanelId] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);


    useEffect(() => {
        const sortedLayout = [...comicLayout].sort((a, b) => a.y - b.y || a.x - b.x);
        
        setPanels(
            sortedLayout.map((item, index) => ({
                id: item.i,
                image: initialImages[index],
                fitting: 'cover',
                zoom: 1,
                positionX: 50,
                positionY: 50,
                rotation: 0,
            }))
        );
    }, [comicLayout, initialImages]);

    const handlePanelPropertyChange = (panelId: string, prop: keyof Omit<PanelData, 'id' | 'image'>, value: any) => {
        setPanels(panels.map(p => {
            if (p.id === panelId) {
                return { ...p, [prop]: value };
            }
            return p;
        }));
    };
    
    const handleFittingChange = (panelId: string, newFitting: 'contain' | 'cover') => {
        setPanels(currentPanels => currentPanels.map(p => {
            if (p.id !== panelId) return p;

            if (newFitting === 'contain') {
                return { ...p, fitting: 'contain', zoom: 1, positionX: 50, positionY: 50 };
            }

            // Logic for 'cover' (Zoom to Fill)
            if (!p.image?.width || !p.image.height) {
                return { ...p, fitting: 'cover', zoom: 1, positionX: 50, positionY: 50 };
            }

            const layoutItem = comicLayout.find(item => item.i === p.id);
            if (!layoutItem) return p;

            const panelAspect = layoutItem.w / layoutItem.h;
            const imageAspect = p.image.width / p.image.height;

            const zoomToFill = panelAspect > imageAspect 
                ? panelAspect / imageAspect 
                : imageAspect / panelAspect;

            return { ...p, fitting: 'cover', zoom: zoomToFill, positionX: 50, positionY: 50 };
        }));
    };

    const handleTextPropChange = (
        setter: Dispatch<SetStateAction<TextProperties>>,
        prop: keyof TextProperties,
        value: any
    ) => {
        setter(prev => ({ ...prev, [prop]: value }));
    };

    const handleChangeImageClick = (panelId: string) => {
        setPanelIdToUpdate(panelId);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !panelIdToUpdate) {
            return;
        }

        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        const img = new Image();
        
        img.onload = () => {
            const newImage: UploadedImage = {
                id: `${file.name}-${file.lastModified}-${Math.random()}`,
                file,
                url,
                width: img.width,
                height: img.height,
            };

            setPanels(currentPanels =>
                currentPanels.map(p => {
                    if (p.id === panelIdToUpdate) {
                        if (p.image?.url) {
                            URL.revokeObjectURL(p.image.url);
                        }
                        // When image is replaced, reset its properties
                        return { ...p, image: newImage, fitting: 'cover', zoom: 1, positionX: 50, positionY: 50, rotation: 0 };
                    }
                    return p;
                })
            );

            setPanelIdToUpdate(null);
        };
        
        img.onerror = () => {
             alert('Could not load the new image file.');
             setPanelIdToUpdate(null);
        }

        img.src = url;

        if (event.target) {
            event.target.value = '';
        }
    };
    
    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (index !== dragOverIndex) {
            setDragOverIndex(index);
        }
    };
    
    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const draggedIdx = draggedIndex;
        
        setDraggedIndex(null);
        setDragOverIndex(null);

        if (draggedIdx === null || draggedIdx === dropIndex) {
            return;
        }

        setPanels(currentPanels => {
            const newPanels = [...currentPanels];
            const draggedPanel = newPanels[draggedIdx];
            const dropPanel = newPanels[dropIndex];

            // Extract the swappable content from both panels
            const draggedContent = {
                image: draggedPanel.image, fitting: draggedPanel.fitting, zoom: draggedPanel.zoom,
                positionX: draggedPanel.positionX, positionY: draggedPanel.positionY, rotation: draggedPanel.rotation,
            };
            const dropContent = {
                image: dropPanel.image, fitting: dropPanel.fitting, zoom: dropPanel.zoom,
                positionX: dropPanel.positionX, positionY: dropPanel.positionY, rotation: dropPanel.rotation,
            };
            
            // Swap the content while preserving the panel's unique ID
            newPanels[draggedIdx] = { ...newPanels[draggedIdx], ...dropContent };
            newPanels[dropIndex] = { ...newPanels[dropIndex], ...draggedContent };
            
            return newPanels;
        });
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleExport = async (format: 'png' | 'jpeg' | 'webp') => {
        if (!comicPageRef.current || isExporting || !exportFilename.trim()) return;

        setIsExporting(true);
        const node = comicPageRef.current;

        try {
            const targetWidth = pageSize.width;
            const scale = targetWidth / node.offsetWidth;

            const options = {
                quality: 0.98,
                backgroundColor: '#ffffff',
                pixelRatio: scale,
            };

            let dataUrl;
            switch (format) {
                case 'jpeg':
                    dataUrl = await toJpeg(node, options);
                    break;
                case 'webp':
                    const canvas = await toCanvas(node, options);
                    dataUrl = canvas.toDataURL('image/webp', 0.98);
                    break;
                case 'png':
                default:
                    dataUrl = await toPng(node, options);
                    break;
            }

            const link = document.createElement('a');
            const sanitizedFilename = exportFilename.trim().replace(/[\s/\\?%*:|"<>]/g, '_');
            link.download = `${sanitizedFilename}.${format}`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Export failed:', error);
            alert('Sorry, something went wrong during the export.');
        } finally {
            setIsExporting(false);
        }
    };

    const renderTextCustomizer = (
        props: TextProperties, 
        setter: Dispatch<SetStateAction<TextProperties>>, 
        label: string
    ) => (
        <div className="space-y-4 rounded-lg border border-gray-600 p-4">
            <h3 className="text-xl font-bold text-gray-200 font-bangers tracking-wide">{label} Settings</h3>
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Text</label>
                <input
                    type="text"
                    value={props.content}
                    onChange={(e) => handleTextPropChange(setter, 'content', e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Font</label>
                    <select value={props.fontFamily} onChange={(e) => handleTextPropChange(setter, 'fontFamily', e.target.value)} className="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition h-[44px]">
                        {FONT_OPTIONS.map(font => <option key={font.name} value={font.value}>{font.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Color</label>
                    <input type="color" value={props.color} onChange={(e) => handleTextPropChange(setter, 'color', e.target.value)} className="w-full h-[44px] bg-gray-700 border-2 border-gray-600 rounded-md p-1 cursor-pointer"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Position X ({props.positionX.toFixed(0)}%)</label>
                <input type="range" min="0" max="100" step="1" value={props.positionX} onChange={(e) => handleTextPropChange(setter, 'positionX', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
            </div>
             <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Position Y ({props.positionY.toFixed(0)}%)</label>
                <input type="range" min="0" max="100" step="1" value={props.positionY} onChange={(e) => handleTextPropChange(setter, 'positionY', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Font Size ({props.fontSize.toFixed(1)}rem)</label>
                <input type="range" min="1" max="10" step="0.1" value={props.fontSize} onChange={(e) => handleTextPropChange(setter, 'fontSize', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
            </div>
        </div>
    );
    
    const panelDataMap = new Map(panels.map(p => [p.id, p]));

    return (
        <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-8 grid grid-cols-1 xl:grid-cols-[minmax(0,_380px)_1fr_minmax(0,_380px)] gap-8 animate-[fade-in_0.5s_ease-in-out]">
            {/* Hidden file input for changing individual panel images */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            
            {/* Left Column: Panel Layers */}
            <div className="w-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
                <h2 className="text-3xl font-black text-cyan-400 mb-6 font-bangers">Panel Layers</h2>
                <div className="space-y-4">
                    {panels.map((panel, index) => {
                        const isExpanded = expandedPanelId === panel.id;
                        const isDragged = draggedIndex === index;
                        const isDragTarget = dragOverIndex === index && draggedIndex !== index;

                        return (
                            <div 
                                key={panel.id}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`bg-gray-700/50 rounded-lg border border-gray-600 transition-all duration-200 ${isDragged ? 'opacity-30 scale-95' : 'opacity-100 scale-100'} ${isDragTarget ? 'ring-2 ring-cyan-400' : ''}`}
                            >
                                <div className="flex items-center space-x-3 p-3">
                                    <div 
                                        className="cursor-grab text-gray-500 hover:text-white p-2"
                                        title="Drag to reorder image"
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </div>
                                    {panel.image && (
                                        <img
                                            src={panel.image.url}
                                            alt={`Preview for Panel ${index + 1}`}
                                            className="w-12 h-12 object-cover rounded-md border-2 border-gray-600 flex-shrink-0"
                                        />
                                    )}
                                    <p className="font-bold text-white flex-1 truncate">Panel {index + 1}</p>
                                    <button onClick={() => setExpandedPanelId(isExpanded ? null : panel.id)} title={isExpanded ? 'Collapse' : 'Expand'} className="p-1 rounded-full bg-gray-600 text-white hover:bg-cyan-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div 
                                    className={`space-y-4 px-3 transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 pb-3' : 'max-h-0'}`}
                                >
                                    <div className="pt-2 border-t border-gray-600/50">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button onClick={() => handleFittingChange(panel.id, 'contain')} className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold text-white ${panel.fitting === 'contain' ? 'bg-cyan-600 ring-2 ring-cyan-400' : 'bg-gray-600 hover:bg-gray-500'}`}>Fit (Show All)</button>
                                            <button onClick={() => handleFittingChange(panel.id, 'cover')} className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold text-white ${panel.fitting === 'cover' ? 'bg-cyan-600 ring-2 ring-cyan-400' : 'bg-gray-600 hover:bg-gray-500'}`}>Fill (Crop)</button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleChangeImageClick(panel.id)}
                                        className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold bg-gray-600 text-white hover:bg-gray-500"
                                    >
                                        Change Image
                                    </button>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Zoom ({panel.zoom.toFixed(2)}x)</label>
                                        <input type="range" min="0.5" max="3" step="0.05" value={panel.zoom} onChange={(e) => handlePanelPropertyChange(panel.id, 'zoom', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Position X ({panel.positionX.toFixed(0)}%)</label>
                                        <input type="range" min="0" max="100" step="1" value={panel.positionX} onChange={(e) => handlePanelPropertyChange(panel.id, 'positionX', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" title="Adjust horizontal position"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Position Y ({panel.positionY.toFixed(0)}%)</label>
                                        <input type="range" min="0" max="100" step="1" value={panel.positionY} onChange={(e) => handlePanelPropertyChange(panel.id, 'positionY', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" title="Adjust vertical position"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1">Rotation ({panel.rotation.toFixed(0)}°)</label>
                                        <input type="range" min="-180" max="180" step="1" value={panel.rotation} onChange={(e) => handlePanelPropertyChange(panel.id, 'rotation', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>


            {/* Center Column: Preview */}
            <div className="w-full flex-1 flex justify-center items-center order-first xl:order-none min-h-[60vh] xl:min-h-0">
                <div 
                    ref={comicPageRef} 
                    className="w-full max-w-[800px] max-h-full bg-white shadow-2xl rounded-lg relative border-4 border-gray-600 overflow-hidden" 
                    style={{ aspectRatio: `${pageSize.width} / ${pageSize.height}` }}
                >
                    {/* Comic Content Area */}
                     <div 
                        className="w-full h-full grid"
                        style={{
                            gridTemplateColumns: `repeat(${PAGE_GRID_COLS}, 1fr)`,
                            gridTemplateRows: `repeat(${PAGE_GRID_ROWS}, 1fr)`,
                            gap: `${pageSettings.gutterSize}px`,
                            padding: `${pageSettings.pageMargin}px`,
                            boxSizing: 'border-box',
                        }}
                     >
                        {comicLayout.map(item => {
                            const panel = panelDataMap.get(item.i);
                            return (
                                <div 
                                    key={item.i} 
                                    className="relative overflow-hidden rounded-sm"
                                    style={{
                                        gridColumn: `${item.x + 1} / span ${item.w}`,
                                        gridRow: `${item.y + 1} / span ${item.h}`,
                                        border: `${panelStyle.panelBorderSize}px solid ${panelStyle.panelBorderColor}`,
                                        backgroundColor: panelStyle.panelBackgroundColor,
                                    }}
                                >
                                    {panel?.image && (
                                        <img
                                            src={panel.image.url}
                                            alt={`Panel ${panel.id}`}
                                            className="w-full h-full transition-transform duration-200 ease-in-out"
                                            style={{
                                                objectFit: panel.fitting === 'contain' ? 'contain' : 'cover', // Use the fitting property
                                                transform: `scale(${panel.zoom}) translate(${(panel.positionX - 50)}%, ${(panel.positionY - 50)}%) rotate(${panel.rotation}deg)`,
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Text Overlays */}
                    {[titleProps, pageNumberProps].map((props, i) => {
                        const isTitle = i === 0;
                        const textAlign = isTitle ? 'left' : 'right';
                        const horizontalTransform = isTitle ? '0%' : '-100%';

                        return props.content && (
                            <div
                                key={i}
                                className="absolute tracking-wider pointer-events-none p-2"
                                style={{
                                    fontFamily: props.fontFamily,
                                    fontSize: `${props.fontSize}rem`,
                                    color: props.color,
                                    top: `${props.positionY}%`,
                                    left: `${props.positionX}%`,
                                    transform: `translate(${horizontalTransform}, -${props.positionY}%)`,
                                    width: 'auto',
                                    maxWidth: '100%',
                                    textAlign: textAlign as 'left' | 'right',
                                }}
                            >
                                {props.content}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right Column: Global Settings & Export */}
            <div className="w-full bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-fit max-h-[calc(100vh-140px)] overflow-y-auto">
                <h2 className="text-3xl font-black text-cyan-400 mb-6 font-bangers">Settings & Export</h2>
                <div className="space-y-6">
                    {/* Export Controls */}
                    <div className="space-y-4 rounded-lg border border-gray-600 p-4">
                        <h3 className="text-xl font-bold text-gray-200 font-bangers tracking-wide">Export</h3>
                        <div>
                            <label htmlFor="exportFilename" className="block text-sm font-bold text-gray-300 mb-1">File Name</label>
                            <input
                                id="exportFilename"
                                type="text"
                                value={exportFilename}
                                onChange={(e) => setExportFilename(e.target.value)}
                                placeholder="Enter file name..."
                                className="w-full bg-gray-700 border-2 border-gray-600 rounded-md px-3 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                             <button onClick={() => handleExport('png')} disabled={isExporting || !exportFilename.trim()} className="px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed"> {isExporting ? '...' : 'PNG'} </button>
                             <button onClick={() => handleExport('jpeg')} disabled={isExporting || !exportFilename.trim()} className="px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed"> {isExporting ? '...' : 'JPEG'} </button>
                             <button onClick={() => handleExport('webp')} disabled={isExporting || !exportFilename.trim()} className="px-3 py-2 text-sm rounded-md transition-all duration-200 font-semibold bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed"> {isExporting ? '...' : 'WEBP'} </button>
                        </div>
                         {isExporting && <p className="text-center text-sm text-cyan-400 animate-pulse mt-2">Generating your masterpiece...</p>}
                    </div>
                
                    {/* Page Settings */}
                    <div className="space-y-4 rounded-lg border border-gray-600 p-4">
                        <h3 className="text-xl font-bold text-gray-200 font-bangers tracking-wide">Page Settings</h3>
                         <div>
                           <label htmlFor="pageMargin" className="block text-sm font-bold text-gray-300 mb-1">Page Margin ({pageSettings.pageMargin}px)</label>
                           <input id="pageMargin" type="range" min="0" max="50" value={pageSettings.pageMargin} onChange={(e) => onPageSettingsChange(prev => ({ ...prev, pageMargin: parseInt(e.target.value, 10)}))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                        <div>
                           <label htmlFor="gutterSize" className="block text-sm font-bold text-gray-300 mb-1">Gutter Size ({pageSettings.gutterSize}px)</label>
                           <input id="gutterSize" type="range" min="0" max="40" value={pageSettings.gutterSize} onChange={(e) => onPageSettingsChange(prev => ({ ...prev, gutterSize: parseInt(e.target.value, 10)}))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                    
                    {/* Panel Style Settings */}
                    <div className="space-y-4 rounded-lg border border-gray-600 p-4">
                        <h3 className="text-xl font-bold text-gray-200 font-bangers tracking-wide">Panel Style</h3>
                        <div>
                           <label htmlFor="panelBorderSize" className="block text-sm font-bold text-gray-300 mb-1">Panel Border Size ({panelStyle.panelBorderSize}px)</label>
                           <input id="panelBorderSize" type="range" min="0" max="20" value={panelStyle.panelBorderSize} onChange={(e) => onPanelStyleChange(prev => ({ ...prev, panelBorderSize: parseInt(e.target.value, 10)}))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Panel Border Color</label>
                            <input type="color" value={panelStyle.panelBorderColor} onChange={(e) => onPanelStyleChange(prev => ({ ...prev, panelBorderColor: e.target.value}))} className="w-full h-10 bg-gray-700 border-2 border-gray-600 rounded-md p-1 cursor-pointer"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-1">Panel Background Color</label>
                            <input type="color" value={panelStyle.panelBackgroundColor} onChange={(e) => onPanelStyleChange(prev => ({ ...prev, panelBackgroundColor: e.target.value}))} className="w-full h-10 bg-gray-700 border-2 border-gray-600 rounded-md p-1 cursor-pointer"/>
                        </div>
                    </div>

                    {renderTextCustomizer(titleProps, onTitlePropsChange, 'Title')}
                    {renderTextCustomizer(pageNumberProps, onPageNumberPropsChange, 'Page Number')}

                    <div className="pt-4 border-t border-gray-700 space-y-3">
                         <button 
                            onClick={onChangeTemplate} 
                            className="w-full px-6 py-3 rounded-md bg-gray-600 text-white font-bold hover:bg-gray-500 transition-colors shadow-lg transform hover:-translate-y-0.5"
                        >
                            Change Template
                        </button>
                        <button 
                            onClick={onReset} 
                            className="w-full px-6 py-3 rounded-md bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
