
import React, { useState, useEffect } from 'react';
import { PageSizeSelector } from './components/PageSizeSelector';
import { PanelCountSelector } from './components/PanelCountSelector';
import { TemplateSelector } from './components/TemplateSelector';
import { ImageUploader } from './components/ImageUploader';
import { ComicPageEditor } from './components/ComicPageEditor';
import { LayoutEditor } from './components/LayoutEditor';
import { Modal } from './components/Modal';
import { FONT_OPTIONS } from './constants';
import type { UploadedImage, ComicLayout, TextProperties, PageSettings, PanelStyle, PageSize } from './types';

type AppStep = 'SELECT_PAGE_SIZE' | 'SELECT_COUNT' | 'SELECT_TEMPLATE' | 'CREATE_TEMPLATE' | 'UPLOAD_IMAGES' | 'EDIT_PAGE';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>('SELECT_PAGE_SIZE');
    const [pageSize, setPageSize] = useState<PageSize | null>(null);
    const [panelCount, setPanelCount] = useState<number | null>(null);
    const [comicLayout, setComicLayout] = useState<ComicLayout | null>(null);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Lifted state for settings persistence
    const [pageSettings, setPageSettings] = useState<PageSettings>({
        gutterSize: 10,
        pageMargin: 25,
    });
    const [panelStyle, setPanelStyle] = useState<PanelStyle>({
        panelBorderSize: 2,
        panelBorderColor: '#000000',
        panelBackgroundColor: '#E5E7EB', // Default light gray (gray-200)
    });
    const [titleProps, setTitleProps] = useState<TextProperties>({
        content: 'My Awesome Story',
        fontSize: 1,
        color: '#000000',
        fontFamily: FONT_OPTIONS[0].value,
        positionX: 3,
        positionY: 0,
    });
    const [pageNumberProps, setPageNumberProps] = useState<TextProperties>({
        content: '1',
        fontSize: 1,
        color: '#000000',
        fontFamily: FONT_OPTIONS[0].value,
        positionX: 97,
        positionY: 100,
    });

    const handlePageSizeSelect = (size: PageSize) => {
        setPageSize(size);
        setStep('SELECT_COUNT');
    };

    const handleCountSelect = (count: number) => {
        setPanelCount(count);
        setStep('SELECT_TEMPLATE');
    };

    const handleTemplateSelect = (layout: ComicLayout) => {
        setComicLayout(layout);
        // If images are already uploaded, go back to editing, otherwise proceed to upload.
        if (uploadedImages.length > 0) {
            setStep('EDIT_PAGE');
        } else {
            setStep('UPLOAD_IMAGES');
        }
    };

    const handleImageUpload = (images: UploadedImage[]) => {
        if (panelCount && images.length === panelCount) {
            setUploadedImages(images);
            setStep('EDIT_PAGE');
        } else {
            setErrorMessage(`Error: The number of uploaded images does not match the required panel count. Expected ${panelCount}, but got ${images.length}.`);
        }
    };
    
    // New function to go back to template selection from the editor
    const handleChangeTemplate = () => {
        setStep('SELECT_TEMPLATE');
    };
    
    const goBack = () => {
        if (step === 'SELECT_COUNT') {
            setStep('SELECT_PAGE_SIZE');
            setPageSize(null);
        } else if (step === 'SELECT_TEMPLATE') {
            setStep('SELECT_COUNT');
            setPanelCount(null);
        } else if (step === 'UPLOAD_IMAGES') {
            setStep('SELECT_TEMPLATE');
            setComicLayout(null);
        }
    };

    const handleReset = () => {
        // Clean up object URLs before resetting state
        uploadedImages.forEach(img => URL.revokeObjectURL(img.url));

        // Only reset per-comic state, not the settings
        setStep('SELECT_PAGE_SIZE');
        setPageSize(null);
        setPanelCount(null);
        setComicLayout(null);
        setUploadedImages([]);
        setErrorMessage(null);
    };

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, [uploadedImages]);

    const renderStep = () => {
        switch (step) {
            case 'SELECT_COUNT':
                if (!pageSize) { handleReset(); return null; }
                return <PanelCountSelector onSelect={handleCountSelect} onBack={goBack} />;
            
            case 'SELECT_TEMPLATE':
                if (!panelCount || !pageSize) { handleReset(); return null; }
                return <TemplateSelector 
                    panelCount={panelCount} 
                    pageSize={pageSize} 
                    onSelect={handleTemplateSelect} 
                    onBack={uploadedImages.length > 0 ? () => setStep('EDIT_PAGE') : goBack} 
                    onSelectCustom={() => setStep('CREATE_TEMPLATE')} />;
            
            case 'CREATE_TEMPLATE':
                if (!panelCount || !pageSize) { handleReset(); return null; }
                return <LayoutEditor 
                    panelCount={panelCount} 
                    pageSize={pageSize} 
                    onConfirm={handleTemplateSelect} 
                    onBack={() => setStep('SELECT_TEMPLATE')} />;

            case 'UPLOAD_IMAGES':
                if (!panelCount || !comicLayout) { handleReset(); return null; }
                return (
                    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center p-4 animate-[fade-in_0.5s_ease-in-out]">
                        <ImageUploader
                            expectedCount={panelCount}
                            onUpload={handleImageUpload}
                            onCancel={goBack}
                        />
                    </div>
                );
            case 'EDIT_PAGE':
                if (!comicLayout || uploadedImages.length === 0 || !pageSize) { handleReset(); return null; }
                return <ComicPageEditor 
                            comicLayout={comicLayout} 
                            pageSize={pageSize}
                            initialImages={uploadedImages} 
                            onReset={handleReset}
                            onChangeTemplate={handleChangeTemplate}
                            pageSettings={pageSettings}
                            onPageSettingsChange={setPageSettings}
                            panelStyle={panelStyle}
                            onPanelStyleChange={setPanelStyle}
                            titleProps={titleProps}
                            onTitlePropsChange={setTitleProps}
                            pageNumberProps={pageNumberProps}
                            onPageNumberPropsChange={setPageNumberProps}
                        />;
            
            case 'SELECT_PAGE_SIZE':
            default:
                return <PageSizeSelector onSelect={handlePageSizeSelect} />;
        }
    };

    return (
        <main className="bg-gray-900 text-white">
            <header className="py-4 px-8 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-30">
                <h1 className="text-4xl font-black text-white tracking-wider font-bangers">
                    <span className="text-cyan-400">Framing</span>Book
                </h1>
            </header>
            
            <div className="min-h-[calc(100vh-150px)]">
                {renderStep()}
            </div>
            
            {errorMessage && (
                <Modal title="Validation Error" onClose={() => setErrorMessage(null)}>
                    <p>{errorMessage}</p>
                </Modal>
            )}

            <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-800">
                <p>Designed and built by a world-class senior frontend engineer.</p>
                <p>&copy; {new Date().getFullYear()} Framing Book. All Rights Reserved.</p>
            </footer>
        </main>
    );
};

export default App;
