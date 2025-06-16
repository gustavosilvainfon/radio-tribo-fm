'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  preview?: boolean;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  placeholder = "Cole o link da imagem aqui", 
  preview = true 
}: ImageUploadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(value);
  const [imageError, setImageError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onChange(tempUrl);
    setIsEditing(false);
    setImageError(false);
  };

  const handleCancel = () => {
    setTempUrl(value);
    setIsEditing(false);
    setImageError(false);
  };

  const handleClear = () => {
    onChange('');
    setTempUrl('');
    setIsEditing(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const suggestedImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face'
  ];

  return (
    <div className="space-y-4">
      {/* Preview da imagem atual */}
      {preview && value && !imageError && (
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={value}
            alt="Preview"
            width={128}
            height={128}
            className="w-full h-full object-cover rounded-lg border-2 border-gray-600"
            onError={handleImageError}
            unoptimized
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Campo de entrada de URL */}
      {(isEditing || !value || imageError) && (
        <div className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="url"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            {tempUrl && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Botões de ação */}
          {isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Preview da nova imagem */}
          {tempUrl && tempUrl !== value && (
            <div className="relative w-24 h-24 mx-auto">
              <Image
                src={tempUrl}
                alt="Preview"
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-lg border-2 border-blue-500"
                onError={() => setImageError(true)}
                unoptimized
              />
            </div>
          )}

          {/* Imagens sugeridas */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Ou escolha uma das opções:</p>
            <div className="grid grid-cols-3 gap-2">
              {suggestedImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTempUrl(url);
                    onChange(url);
                    setIsEditing(false);
                    setImageError(false);
                  }}
                  className="relative w-full h-16 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-blue-500 transition-colors"
                >
                  <Image
                    src={url}
                    alt={`Opção ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dica sobre URLs */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 <strong>Dica:</strong> Use links do Unsplash, Pixabay ou outros sites de imagens gratuitas. 
              Exemplo: https://images.unsplash.com/...
            </p>
          </div>
        </div>
      )}

      {/* Botão para adicionar imagem quando não há nenhuma */}
      {!value && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full border-2 border-dashed border-gray-600 rounded-lg p-8 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto mb-2" />
          <p>Clique para adicionar imagem</p>
          <p className="text-xs mt-1">Cole o link de uma imagem da internet</p>
        </button>
      )}
    </div>
  );
}