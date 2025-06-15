'use client';

import { useState, useEffect } from 'react';
import { Gift, Trophy, Calendar, Phone, Mail, Instagram, Clock, Star } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  prize: string;
  endDate: Date;
  howToParticipate: string;
  phone: string;
  status: 'active' | 'inactive' | 'ended';
  color: string;
  icon: string;
  order: number;
}

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      // Filter only active promotions
      setPromotions(data.filter((promo: Promotion) => promo.status === 'active'));
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="promotions" className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Carregando promoções...</p>
          </div>
        </div>
      </section>
    );
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <section id="promotions" className="py-12 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gift className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-white">Promoções</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Participe das nossas promoções e concorra a prêmios incríveis!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {promotions.map((promotion) => {
            const daysLeft = calculateDaysLeft(promotion.endDate);
            const isExpired = daysLeft === 0;

            return (
              <div
                key={promotion.id}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  selectedPromotion === promotion.id ? 'ring-4 ring-yellow-500' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${promotion.color} p-6 h-full`}>
                  <div className="text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{promotion.icon}</div>
                      <div className="flex items-center space-x-2">
                        {!isExpired ? (
                          <>
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {daysLeft} dias restantes
                            </span>
                          </>
                        ) : (
                          <span className="text-sm bg-red-500 px-2 py-1 rounded-full">
                            Encerrada
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">
                      {promotion.title}
                    </h3>

                    <p className="text-white/90 mb-4 text-sm">
                      {promotion.description}
                    </p>

                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-300" />
                        <span className="font-semibold">Prêmio:</span>
                      </div>
                      <p className="text-white font-bold">{promotion.prize}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">Válida até:</span>
                        </div>
                        <p className="text-white/90 text-sm">
                          {formatDate(promotion.endDate)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">Como participar:</span>
                        </div>
                        <p className="text-white/90 text-sm">
                          {promotion.howToParticipate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex flex-col space-y-2">
                        <a
                          href={`tel:${promotion.phone}`}
                          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-medium">{promotion.phone}</span>
                        </a>
                        <a
                          href="https://instagram.com/radioribofrm"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm font-medium">@radiotribofm</span>
                        </a>
                      </div>
                    </div>

                    {!isExpired && (
                      <button
                        onClick={() => setSelectedPromotion(
                          selectedPromotion === promotion.id ? null : promotion.id
                        )}
                        className="w-full mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg py-3 px-4 text-white font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Gift className="w-5 h-5" />
                        <span>Quero Participar!</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gray-700 rounded-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            📋 Regulamento Geral das Promoções
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-2">Participação:</h4>
              <ul className="space-y-1">
                <li>• Promoção válida para maiores de 18 anos</li>
                <li>• Apenas uma participação por pessoa</li>
                <li>• Não cumulativo com outras promoções</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Prêmios:</h4>
              <ul className="space-y-1">
                <li>• Prêmios não podem ser trocados por dinheiro</li>
                <li>• Retirada em até 30 dias após o sorteio</li>
                <li>• Documentos necessários para retirada</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600 text-center">
            <p className="text-gray-400 text-xs">
              Para dúvidas sobre as promoções, entre em contato pelo telefone (11) 9999-9999 ou 
              envie um e-mail para promocoes@radiotribofm.com.br
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}