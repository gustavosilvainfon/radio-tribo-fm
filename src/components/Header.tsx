'use client';

import { Radio, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <Radio className="w-8 h-8 text-blue-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Rádio Tribo FM</h1>
              <p className="text-sm text-gray-400">A Sua Música, A Sua Tribo</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Início
            </Link>
            <Link href="#promotions" className="text-gray-300 hover:text-white transition-colors">
              Promoções
            </Link>
            <Link href="#team" className="text-gray-300 hover:text-white transition-colors">
              Equipe
            </Link>
            <Link href="#chat" className="text-gray-300 hover:text-white transition-colors">
              Chat
            </Link>
            <Link href="#news" className="text-gray-300 hover:text-white transition-colors">
              Notícias
            </Link>
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}