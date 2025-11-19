import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultImages = [
    "https://picsum.photos/id/10/800/600",
    "https://picsum.photos/id/11/800/600",
    "https://picsum.photos/id/12/800/600",
    "https://picsum.photos/id/13/800/600",
    "https://picsum.photos/id/14/800/600",
    "https://picsum.photos/id/15/800/600",
];

const Photos: React.FC<AppProps> = ({ initialState }) => {
  const [images, setImages] = useState(defaultImages);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialState?.url) {
        // If an image URL is passed, add it to the start or find it
        const existingIdx = defaultImages.indexOf(initialState.url);
        if (existingIdx !== -1) {
            setCurrentIndex(existingIdx);
        } else {
            setImages([initialState.url, ...defaultImages]);
            setCurrentIndex(0);
        }
    }
  }, [initialState]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="h-full bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
            <img 
                src={images[currentIndex]} 
                alt="Gallery" 
                className="max-w-full max-h-full object-contain shadow-2xl"
            />
            
            <button onClick={prev} className="absolute left-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition">
                <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition">
                <ChevronRight size={24} />
            </button>
        </div>
        <div className="h-20 bg-neutral-900 flex items-center gap-2 overflow-x-auto px-4 p-2 scrollbar-hide">
            {images.map((img, idx) => (
                <img 
                    key={idx}
                    src={img}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-16 w-24 object-cover cursor-pointer rounded border-2 transition ${currentIndex === idx ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                />
            ))}
        </div>
    </div>
  );
};

export default Photos;