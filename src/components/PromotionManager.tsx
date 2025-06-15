'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, Gift, Calendar, Phone, Trophy } from 'lucide-react';

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

const colorOptions = [
  { value: 'from-purple-600 to-pink-600', label: 'Roxo → Rosa', preview: 'bg-gradient-to-r from-purple-600 to-pink-600' },
  { value: 'from-blue-600 to-cyan-600', label: 'Azul → Ciano', preview: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
  { value: 'from-yellow-600 to-orange-600', label: 'Amarelo → Laranja', preview: 'bg-gradient-to-r from-yellow-600 to-orange-600' },
  { value: 'from-green-600 to-emerald-600', label: 'Verde → Esmeralda', preview: 'bg-gradient-to-r from-green-600 to-emerald-600' },
  { value: 'from-red-600 to-rose-600', label: 'Vermelho → Rosa', preview: 'bg-gradient-to-r from-red-600 to-rose-600' },
];

export default function PromotionManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    prize: '',
    endDate: '',
    howToParticipate: '',
    phone: '',
    status: 'active' as 'active' | 'inactive' | 'ended',
    color: 'from-blue-600 to-cyan-600',
    icon: '🎵',
    order: 1,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Erro ao carregar promoções:', error);
    }
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const promotionData = editingPromotion 
        ? { ...editingPromotion, ...newPromotion, endDate: new Date(newPromotion.endDate) }
        : { ...newPromotion, endDate: new Date(newPromotion.endDate) };

      const response = await fetch('/api/promotions', {
        method: editingPromotion ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(promotionData),
      });

      if (response.ok) {
        loadPromotions();
        setEditingPromotion(null);
        setNewPromotion({
          title: '',
          description: '',
          prize: '',
          endDate: '',
          howToParticipate: '',
          phone: '',
          status: 'active',
          color: 'from-blue-600 to-cyan-600',
          icon: '🎵',
          order: promotions.length + 1,
        });
        alert(editingPromotion ? 'Promoção atualizada!' : 'Promoção adicionada!');
      } else {
        alert('Erro ao salvar promoção');
      }
    } catch (error) {
      console.error('Erro ao salvar promoção:', error);
      alert('Erro ao salvar promoção');
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!confirm('Tem certeza que deseja desativar esta promoção?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/promotions?id=${promotionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadPromotions();
        alert('Promoção desativada!');
      } else {
        alert('Erro ao desativar promoção');
      }
    } catch (error) {
      console.error('Erro ao desativar promoção:', error);
      alert('Erro ao desativar promoção');
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setNewPromotion({
      title: promotion.title,
      description: promotion.description,
      prize: promotion.prize,
      endDate: new Date(promotion.endDate).toISOString().split('T')[0],
      howToParticipate: promotion.howToParticipate,
      phone: promotion.phone,
      status: promotion.status,
      color: promotion.color,
      icon: promotion.icon,
      order: promotion.order,
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-600',
      inactive: 'bg-gray-600',
      ended: 'bg-red-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativa',
      inactive: 'Inativa',
      ended: 'Encerrada',
    };
    return labels[status] || status;
  };

  const calculateDaysLeft = (endDate: Date) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Promotion Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>{editingPromotion ? 'Editar Promoção' : 'Adicionar Promoção'}</span>
        </h2>

        <form onSubmit={handleSavePromotion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título da Promoção
            </label>
            <input
              type="text"
              value={newPromotion.title}
              onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={newPromotion.description}
              onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              rows={3}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prêmio
              </label>
              <input
                type="text"
                value={newPromotion.prize}
                onChange={(e) => setNewPromotion({ ...newPromotion, prize: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ex: 2 Ingressos VIP"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Como Participar
            </label>
            <textarea
              value={newPromotion.howToParticipate}
              onChange={(e) => setNewPromotion({ ...newPromotion, howToParticipate: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              rows={2}
              placeholder="Ex: Ligue durante o programa e responda a pergunta"
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={newPromotion.phone}
                onChange={(e) => setNewPromotion({ ...newPromotion, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="(11) 9999-9999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={newPromotion.status}
                onChange={(e) => setNewPromotion({ ...newPromotion, status: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
                <option value="ended">Encerrada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ícone
              </label>
              <input
                type="text"
                value={newPromotion.icon}
                onChange={(e) => setNewPromotion({ ...newPromotion, icon: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="🎵"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cor do Gradiente
            </label>
            <div className="grid grid-cols-1 gap-2">
              {colorOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={option.value}
                    checked={newPromotion.color === option.value}
                    onChange={(e) => setNewPromotion({ ...newPromotion, color: e.target.value })}
                    className="text-blue-600"
                  />
                  <div className={`w-20 h-6 rounded ${option.preview}`}></div>
                  <span className="text-gray-300 text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ordem de Exibição
            </label>
            <input
              type="number"
              min="1"
              value={newPromotion.order}
              onChange={(e) => setNewPromotion({ ...newPromotion, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{editingPromotion ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingPromotion && (
              <button
                type="button"
                onClick={() => {
                  setEditingPromotion(null);
                  setNewPromotion({
                    title: '',
                    description: '',
                    prize: '',
                    endDate: '',
                    howToParticipate: '',
                    phone: '',
                    status: 'active',
                    color: 'from-blue-600 to-cyan-600',
                    icon: '🎵',
                    order: promotions.length + 1,
                  });
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Promotions List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Gift className="w-5 h-5" />
          <span>Promoções ({promotions.length})</span>
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {promotions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma promoção cadastrada</p>
          ) : (
            promotions.map((promotion) => {
              const daysLeft = calculateDaysLeft(promotion.endDate);
              
              return (
                <div key={promotion.id} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {promotion.order}
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-white truncate">{promotion.title}</h3>
                      <span className="text-lg">{promotion.icon}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{promotion.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>{promotion.prize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{promotion.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(promotion.status)} text-white`}>
                        {getStatusLabel(promotion.status)}
                      </span>
                      {promotion.status === 'active' && (
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{daysLeft > 0 ? `${daysLeft} dias` : 'Encerra hoje'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Desativar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}