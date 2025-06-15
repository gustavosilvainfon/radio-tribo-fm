'use client';

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface AdBannerProps {
  position: 'top' | 'side' | 'bottom' | 'inline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sampleAds = [
  {
    id: 1,
    title: 'Loja do Som - Instrumentos Musicais',
    description: 'Os melhores instrumentos com até 50% de desconto!',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
    link: '#',
    sponsor: 'Loja do Som',
    category: 'Música',
  },
  {
    id: 2,
    title: 'Café Tribo - O Melhor Café da Cidade',
    description: 'Venha saborear nosso café especial com música ao vivo!',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=200&fit=crop',
    link: '#',
    sponsor: 'Café Tribo',
    category: 'Alimentação',
  },
  {
    id: 3,
    title: 'Auto Escola Direção Certa',
    description: 'Aprenda a dirigir com segurança e qualidade!',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop',
    link: '#',
    sponsor: 'Auto Escola Direção Certa',
    category: 'Educação',
  },
  {
    id: 4,
    title: 'Pizzaria Sabor & Cia',
    description: 'As melhores pizzas da cidade com entrega grátis!',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=200&fit=crop',
    link: '#',
    sponsor: 'Pizzaria Sabor & Cia',
    category: 'Alimentação',
  },
];

export default function AdBanner({ position, size = 'medium', className = '' }: AdBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-full max-w-sm h-32';
      case 'large':
        return 'w-full max-w-2xl h-64';
      default:
        return 'w-full max-w-lg h-48';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'mb-8';
      case 'bottom':
        return 'mt-8';
      case 'side':
        return 'sticky top-4';
      case 'inline':
        return 'my-6';
      default:
        return '';
    }
  };

  const currentAd = sampleAds[currentAdIndex];

  if (!isVisible) return null;

  return (
    <div className={`${getSizeClasses()} ${getPositionClasses()} ${className}`}>
      <div className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors group">
        {/* Close button for side ads */}
        {position === 'side' && (
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 z-10 w-6 h-6 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        )}

        {/* Ad content */}
        <a
          href={currentAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          <div className="relative h-full">
            <Image
              src={currentAd.imageUrl}
              alt={currentAd.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x200/374151/ffffff?text=Anúncio';
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                  {currentAd.category}
                </span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {currentAd.title}
              </h3>
              
              <p className="text-xs text-gray-300 line-clamp-2">
                {currentAd.description}
              </p>
              
              <div className="mt-2 text-xs text-gray-400">
                Patrocinado por {currentAd.sponsor}
              </div>
            </div>
          </div>
        </a>

        {/* Navigation dots for multiple ads */}
        {sampleAds.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {sampleAds.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentAdIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ad indicator */}
      <div className="text-center mt-2">
        <span className="text-xs text-gray-500">Publicidade</span>
      </div>
    </div>
  );
}