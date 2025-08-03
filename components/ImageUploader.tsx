
import React, { useRef, useState, useEffect } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  expectedCount: number;
  onUpload: (images: UploadedImage[]) => void;
  onCancel: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ expectedCount, onUpload, onCancel }) => {
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Create object URLs for previews
    const newPreviews = stagedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [stagedFiles]);
  
  const handleFiles = (files: File[]) => {
    setError(null);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    const remainingSlots = expectedCount - stagedFiles.length;
    if (imageFiles.length > remainingSlots) {
        setError(`You can only add ${remainingSlots} more image(s). Please select fewer files.`);
        return;
    }

    setStagedFiles(prevFiles => [...prevFiles, ...imageFiles]);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    handleFiles(Array.from(files));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (indexToRemove: number) => {
    setError(null);
    setStagedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleDuplicateFile = (indexToDuplicate: number) => {
    if (stagedFiles.length >= expectedCount) {
        return;
    }
    setError(null);
    const fileToDuplicate = stagedFiles[indexToDuplicate];
    setStagedFiles(prevFiles => [...prevFiles, fileToDuplicate]);
  };

  const handleConfirmClick = async () => {
    if (stagedFiles.length !== expectedCount) {
        setError(`Please select exactly ${expectedCount} images.`);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
        const imagePromises = stagedFiles.map(file => {
            return new Promise<UploadedImage>((resolve, reject) => {
                const img = new Image();
                const url = URL.createObjectURL(file);
                img.onload = () => {
                    resolve({
                        id: `${file.name}-${file.lastModified}-${Math.random()}`,
                        file,
                        url, // This URL will be used by ComicPageEditor
                        width: img.width,
                        height: img.height,
                    });
                    // Note: We don't revoke 'url' here because it's passed to the next component.
                    // The App component's useEffect cleanup will handle it eventually.
                };
                img.onerror = (err) => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Could not load image file.'));
                };
                img.src = url;
            });
        });

        const uploadedImages = await Promise.all(imagePromises);
        onUpload(uploadedImages);

    } catch(err) {
        setError('There was an error reading one of the image files. Please try again.');
        console.error(err);
        setIsLoading(false);
    }
  };

  const openFileDialog = () => {
    if (isLoading || stagedFiles.length >= expectedCount) return;
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (isLoading || stagedFiles.length >= expectedCount) return;
      setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation(); // Necessary to allow drop
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (isLoading || stagedFiles.length >= expectedCount) return;
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
          handleFiles(Array.from(files));
      }
  };
  
  const canConfirm = stagedFiles.length === expectedCount && !isLoading;
  const remainingCount = expectedCount - stagedFiles.length;

  return (
    <div 
        className={`w-full max-w-4xl mx-auto p-8 text-center bg-gray-800 rounded-xl shadow-2xl border transition-all duration-300 ${isDraggingOver ? 'border-cyan-500 ring-4 ring-cyan-500/30' : 'border-gray-700'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <div className="pointer-events-none">
        <h2 className="text-5xl font-black text-cyan-400 mb-2 font-bangers">Step 4: Upload Your Art</h2>
        <p className="text-center text-gray-400 mb-1 text-lg">
          Your chosen template has <strong className="text-white font-bold">{expectedCount}</strong> panels. 
          {remainingCount > 0 ? ` Please add ${remainingCount} more image(s).` : ' All images selected!'}
        </p>
         <p className="text-center text-gray-500 mb-6 text-base">Click to browse, or drag & drop files here.</p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading || stagedFiles.length >= expectedCount}
      />

      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 min-h-[140px]">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {previews.map((previewUrl, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md shadow-md"/>
              <button
                onClick={() => handleDuplicateFile(index)}
                disabled={stagedFiles.length >= expectedCount}
                className="absolute -top-2 -left-2 bg-cyan-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-cyan-500 focus:opacity-100 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed"
                aria-label={`Duplicate image ${index + 1}`}
                title="Duplicate Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                onClick={() => handleRemoveFile(index)} 
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 focus:opacity-100"
                aria-label={`Remove image ${index + 1}`}
                title="Remove Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          {stagedFiles.length < expectedCount && (
            <button
              onClick={openFileDialog}
              className="aspect-square flex flex-col items-center justify-center bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-md text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-all"
              aria-label="Add more images"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs mt-1 font-semibold">Add Image</span>
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 mt-4 text-center font-semibold animate-pulse">{error}</p>}

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="px-8 py-3 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-lg"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          onClick={handleConfirmClick}
          className="px-8 py-3 rounded-md bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={!canConfirm}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : `Confirm Selection`}
        </button>
      </div>
    </div>
  );
};
