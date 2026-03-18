import React, { useEffect, useState } from 'react';

interface ImagePreviewProps {
    file?: File | null;
    existingImageUrl?: string | null;
    onClear?: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ file, existingImageUrl, onClear }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } 
        else if (existingImageUrl) {
            setPreviewUrl(existingImageUrl);
        } 
        else {
            setPreviewUrl(null);
        }
    }, [file, existingImageUrl]);

    if (!previewUrl) {
        return (
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">No image selected</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden group bg-gray-100">
            <img 
                src={previewUrl} 
                alt="Item preview" 
                className="w-full h-full object-cover" 
            />
            
            {onClear && (
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={onClear}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-colors"
                    >
                        Remove Image
                    </button>
                </div>
            )}
        </div>
    );
};