'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { NewsItem } from '@/types';

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section id="news" className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Carregando notícias...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-12 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Newspaper className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Notícias</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-4 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Atualizar notícias"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-gray-400">Últimas notícias em tempo real</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.slice(0, 12).map((article) => (
                <article
                  key={article.id}
                  className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <time>{formatDate(article.pubDate)}</time>
                      </div>
                      {article.category && (
                        <span className="px-2 py-1 bg-blue-600 text-xs rounded-full">
                          {article.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {truncateText(article.title, 100)}
                    </h3>

                    {article.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {truncateText(article.description, 150)}
                      </p>
                    )}

                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      <span>Ler mais</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          {news.length > 12 && (
            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Mostrando 12 de {news.length} notícias
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}