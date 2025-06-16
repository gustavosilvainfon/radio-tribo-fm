'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, Clock } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  emoji: string;
  schedule: string;
  description: string;
  isActive: boolean;
  order: number;
}

export default function ProgramManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: '',
    emoji: '🎵',
    schedule: '',
    description: '',
    order: 1,
  });

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const response = await fetch('/api/settings?category=programs');
      const settings = await response.json();
      
      if (settings.length === 0) {
        // Programas padrão se não houver no banco
        const defaultPrograms = [
          { id: '1', name: 'Bom dia Tribo', emoji: '🌅', schedule: '6h às 10h', description: 'Acordando com você', isActive: true, order: 1 },
          { id: '2', name: '100% Sertanejo', emoji: '🤠', schedule: '14h às 18h', description: 'O melhor do sertanejo', isActive: true, order: 2 },
          { id: '3', name: 'Tribo Mania', emoji: '🎵', schedule: '18h às 22h', description: 'Hits do momento', isActive: true, order: 3 },
          { id: '4', name: 'Tribo News', emoji: '📰', schedule: 'Toda hora', description: 'Informação atualizada', isActive: true, order: 4 },
        ];
        setPrograms(defaultPrograms);
      } else {
        const programList = settings.map((setting: any) => JSON.parse(setting.value));
        setPrograms(programList.sort((a: any, b: any) => a.order - b.order));
      }
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
    }
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const programData = editingProgram 
        ? { ...editingProgram, ...newProgram }
        : { ...newProgram, id: Date.now().toString(), isActive: true };

      // Salvar no banco como configuração
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: `program_${programData.id}`,
          value: JSON.stringify(programData),
          category: 'programs',
          description: `Programa: ${programData.name}`
        }),
      });

      if (response.ok) {
        loadPrograms();
        setEditingProgram(null);
        setNewProgram({
          name: '',
          emoji: '🎵',
          schedule: '',
          description: '',
          order: programs.length + 1,
        });
        alert(editingProgram ? 'Programa atualizado!' : 'Programa adicionado!');
      } else {
        alert('Erro ao salvar programa');
      }
    } catch (error) {
      console.error('Erro ao salvar programa:', error);
      alert('Erro ao salvar programa');
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('Tem certeza que deseja remover este programa?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/settings?key=program_${programId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadPrograms();
        alert('Programa removido!');
      } else {
        alert('Erro ao remover programa');
      }
    } catch (error) {
      console.error('Erro ao remover programa:', error);
      alert('Erro ao remover programa');
    }
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setNewProgram({
      name: program.name,
      emoji: program.emoji,
      schedule: program.schedule,
      description: program.description,
      order: program.order,
    });
  };

  const emojiOptions = ['🎵', '🌅', '🤠', '📰', '🎧', '🎤', '🎶', '🔥', '⭐', '🎉'];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Nossa Programação</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>{editingProgram ? 'Editar Programa' : 'Adicionar Programa'}</span>
          </h3>

          <form onSubmit={handleSaveProgram} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Programa
                </label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Ex: Bom dia Tribo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewProgram({ ...newProgram, emoji })}
                      className={`w-full h-10 rounded border text-lg transition-colors ${
                        newProgram.emoji === emoji
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Horário
              </label>
              <input
                type="text"
                value={newProgram.schedule}
                onChange={(e) => setNewProgram({ ...newProgram, schedule: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ex: 6h às 10h ou Segunda a Sexta - 14h às 18h"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <input
                type="text"
                value={newProgram.description}
                onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ex: O melhor do sertanejo para você"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                min="1"
                value={newProgram.order}
                onChange={(e) => setNewProgram({ ...newProgram, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{editingProgram ? 'Atualizar Programa' : 'Adicionar Programa'}</span>
            </button>

            {editingProgram && (
              <button
                type="button"
                onClick={() => {
                  setEditingProgram(null);
                  setNewProgram({
                    name: '',
                    emoji: '🎵',
                    schedule: '',
                    description: '',
                    order: programs.length + 1,
                  });
                }}
                className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        {/* Lista de Programas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6">Programas Atuais</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {programs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Nenhum programa configurado ainda
              </p>
            ) : (
              programs.map((program) => (
                <div key={program.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className="text-2xl">{program.emoji}</div>
                  
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-white">{program.name}</h4>
                    <p className="text-blue-400 text-sm">{program.schedule}</p>
                    <p className="text-gray-400 text-sm">{program.description}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProgram(program)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Preview da programação */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="font-semibold text-white mb-3">Preview no Site:</h4>
            <div className="bg-gray-900 rounded p-4">
              <h5 className="text-lg font-semibold text-white mb-3">Nossa Programação</h5>
              <ul className="space-y-1 text-gray-400">
                {programs.map((program) => (
                  <li key={program.id}>
                    {program.emoji} {program.name} - {program.schedule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}