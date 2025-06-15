'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, Users } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  schedule: string;
  specialty: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    description: '',
    imageUrl: '',
    schedule: '',
    specialty: '',
    icon: '🎵',
    order: 1,
  });

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      setTeam(data);
    } catch (error) {
      console.error('Erro ao carregar equipe:', error);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const memberData = editingMember 
        ? { ...editingMember, ...newMember }
        : { ...newMember, isActive: true };

      const response = await fetch('/api/team', {
        method: editingMember ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        loadTeam();
        setEditingMember(null);
        setNewMember({
          name: '',
          role: '',
          description: '',
          imageUrl: '',
          schedule: '',
          specialty: '',
          icon: '🎵',
          order: team.length + 1,
        });
        alert(editingMember ? 'Membro atualizado!' : 'Membro adicionado!');
      } else {
        alert('Erro ao salvar membro da equipe');
      }
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      alert('Erro ao salvar membro da equipe');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da equipe?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/team?id=${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadTeam();
        alert('Membro removido!');
      } else {
        alert('Erro ao remover membro');
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      alert('Erro ao remover membro');
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      role: member.role,
      description: member.description,
      imageUrl: member.imageUrl,
      schedule: member.schedule,
      specialty: member.specialty,
      icon: member.icon,
      order: member.order,
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Team Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>{editingMember ? 'Editar Membro' : 'Adicionar Membro'}</span>
        </h2>

        <form onSubmit={handleSaveMember} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Função/Cargo
            </label>
            <input
              type="text"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Ex: Locutor 100% Sertanejo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={newMember.description}
              onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              rows={3}
              placeholder="Descreva as atividades e especialidades"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Horário
              </label>
              <input
                type="text"
                value={newMember.schedule}
                onChange={(e) => setNewMember({ ...newMember, schedule: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ex: Segunda a Sexta - 14h às 18h"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Especialidade
              </label>
              <input
                type="text"
                value={newMember.specialty}
                onChange={(e) => setNewMember({ ...newMember, specialty: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ex: Sertanejo & Country"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Foto
              </label>
              <input
                type="url"
                value={newMember.imageUrl}
                onChange={(e) => setNewMember({ ...newMember, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="https://exemplo.com/foto.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ícone (Emoji)
              </label>
              <input
                type="text"
                value={newMember.icon}
                onChange={(e) => setNewMember({ ...newMember, icon: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="🎵"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ordem de Exibição
            </label>
            <input
              type="number"
              min="1"
              value={newMember.order}
              onChange={(e) => setNewMember({ ...newMember, order: parseInt(e.target.value) })}
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
              <span>{editingMember ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingMember && (
              <button
                type="button"
                onClick={() => {
                  setEditingMember(null);
                  setNewMember({
                    name: '',
                    role: '',
                    description: '',
                    imageUrl: '',
                    schedule: '',
                    specialty: '',
                    icon: '🎵',
                    order: team.length + 1,
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

      {/* Team List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Equipe Atual ({team.length} membros)</span>
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {team.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum membro cadastrado</p>
          ) : (
            team.map((member) => (
              <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {member.order}
                </div>
                
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                  priority={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/50x50/374151/ffffff?text=${member.icon}`;
                  }}
                />

                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-white truncate">{member.name}</h3>
                  <p className="text-gray-400 truncate text-sm">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.schedule}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMember(member)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}