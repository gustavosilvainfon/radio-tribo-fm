'use client';

import { Radio, Waves } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'horizontal' | 'vertical' | 'icon';
  className?: string;
}

export default function Logo({ size = 'md', variant = 'horizontal', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 16, text: 'text-sm', container: 'h-8' },
    md: { icon: 24, text: 'text-lg', container: 'h-10' },
    lg: { icon: 32, text: 'text-2xl', container: 'h-12' },
    xl: { icon: 48, text: 'text-4xl', container: 'h-16' }
  };

  const currentSize = sizes[size];

  if (variant === 'icon') {
    return (
      <div className={`relative ${currentSize.container} ${className}`}>
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
          <Radio size={currentSize.icon} className="text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 shadow-lg">
          <Radio size={currentSize.icon} className="text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <div className="text-center">
          <div className={`font-bold text-white ${currentSize.text}`}>
            Rádio Tribo FM
          </div>
          <div className="text-xs text-gray-400">
            A Sua Música, A Sua Tribo
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 shadow-lg">
        <Radio size={currentSize.icon} className="text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
          <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-white ${currentSize.text}`}>
          Rádio Tribo FM
        </span>
        {size !== 'sm' && (
          <span className="text-xs text-gray-400">
            A Sua Música, A Sua Tribo
          </span>
        )}
      </div>
      <Waves size={16} className="text-blue-400 animate-pulse" />
    </div>
  );
}