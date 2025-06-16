'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface AdBannerProps {
  position: 'top' | 'side' | 'bottom' | 'inline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  sponsor: string;
  category: string;
  position: 'top' | 'side' | 'bottom' | 'inline';
  isActive: boolean;
  order: number;
  clickCount: number;
}

export default function AdBanner({ position, size = 'medium', className = '' }: AdBannerProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    // Auto rotate banners every 10 seconds
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % banners.length);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      // Filter banners by position
      const positionBanners = data.filter((banner: Banner) => banner.position === position && banner.isActive);
      
      if (positionBanners.length === 0) {
        // Se não há banners, criar banners de exemplo
        const defaultBanners = getDefaultBanners(position);
        setBanners(defaultBanners);
      } else {
        setBanners(positionBanners);
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
      // Em caso de erro, usar banners padrão
      const defaultBanners = getDefaultBanners(position);
      setBanners(defaultBanners);
    }
  };

  const getDefaultBanners = (pos: string): Banner[] => {
    const defaults = [
      {
        id: `default-${pos}-1`,
        title: 'Anuncie na Rádio Tribo FM',
        description: 'Alcance milhares de ouvintes todos os dias com seus produtos e serviços',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop&auto=format&q=80',
        link: '/admin',
        sponsor: 'Rádio Tribo FM',
        category: 'Publicidade',
        position: pos as any,
        isActive: true,
        order: 1,
        clickCount: 0
      },
      {
        id: `default-${pos}-2`,
        title: 'Promoção Especial',
        description: 'Concorra a prêmios incríveis participando dos nossos programas ao vivo',
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80',
        link: '#promotions',
        sponsor: 'Rádio Tribo FM',
        category: 'Promoção',
        position: pos as any,
        isActive: true,
        order: 2,
        clickCount: 0
      }
    ];
    
    return defaults;
  };

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

  // Get banners for this position  
  const positionBanners = banners.filter(banner => banner.position === position && banner.isActive);
  
  if (!isVisible || banners.length === 0) return null;
  
  const currentAd = positionBanners[currentAdIndex % positionBanners.length];

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
          onClick={() => {
            // Track click
            fetch(`/api/banners/click?id=${currentAd.id}`, { method: 'POST' }).catch(console.error);
          }}
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
        {positionBanners.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {positionBanners.map((_, index) => (
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