import Header from '@/components/Header';
import RadioPlayer from '@/components/RadioPlayer';
import Chat from '@/components/Chat';
import News from '@/components/News';
import Team from '@/components/Team';
import Promotions from '@/components/Promotions';
import AdBanner from '@/components/AdBanner';
import ProgramSchedule from '@/components/ProgramSchedule';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Headphones, MessageCircle, Newspaper } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Headphones className="w-20 h-20 text-blue-500" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Rádio Tribo FM
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              A Sua Música, A Sua Tribo
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Ao Vivo 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Chat Interativo</span>
              </div>
              <div className="flex items-center space-x-2">
                <Newspaper className="w-4 h-4" />
                <span>Notícias</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-pink-500 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-green-500 rounded-full opacity-20 animate-ping"></div>
        </div>
      </section>



      {/* Banner publicitário superior */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner position="top" size="large" />
      </div>

      {/* Layout principal com sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-3 space-y-12 min-w-0">
            
            {/* Promoções Section */}
            <ErrorBoundary>
              <Promotions />
            </ErrorBoundary>

            {/* Banner inline */}
            <div className="flex justify-center">
              <AdBanner position="inline" size="medium" />
            </div>

            {/* Chat Section */}
            <ErrorBoundary>
              <Chat />
            </ErrorBoundary>

            {/* Team Section */}
            <ErrorBoundary>
              <Team />
            </ErrorBoundary>

            {/* News Section */}
            <ErrorBoundary>
              <News />
            </ErrorBoundary>

          </div>

          {/* Sidebar direita */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="space-y-6 sticky top-4">
              {/* Banner lateral */}
              <AdBanner position="side" size="small" />

              {/* Segundo banner lateral */}
              <AdBanner position="side" size="small" />

              {/* Terceiro banner lateral */}
              <AdBanner position="side" size="small" />
            </div>
          </div>
        </div>
      </div>



      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Rádio Tribo FM</h3>
              <p className="text-gray-400 mb-4">
                A melhor música para acompanhar o seu dia. Junte-se à nossa tribo!
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">@</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">▶</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#promotions" className="hover:text-white transition-colors">Promoções</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Nossa Equipe</a></li>
                <li><a href="#chat" className="hover:text-white transition-colors">Chat</a></li>
                <li><a href="#news" className="hover:text-white transition-colors">Notícias</a></li>
                <li><a href="/admin" className="hover:text-white transition-colors">Administração</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Nossa Programação</h4>
              <ErrorBoundary>
                <ProgramSchedule />
              </ErrorBoundary>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rádio Tribo FM. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Radio Player - Fixed at bottom */}
      <RadioPlayer />
    </main>
  );
}