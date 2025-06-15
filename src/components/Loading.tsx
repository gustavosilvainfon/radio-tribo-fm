import { Radio } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <Radio className="w-12 h-12 text-blue-500 animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      </div>
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
}