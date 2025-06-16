'use client';

import { useState, useEffect } from 'react';

interface Program {
  id: string;
  name: string;
  emoji: string;
  schedule: string;
  description: string;
  isActive: boolean;
  order: number;
}

export default function ProgramSchedule() {
  const [programs, setPrograms] = useState<Program[]>([]);

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
        setPrograms(programList.filter((p: Program) => p.isActive).sort((a: Program, b: Program) => a.order - b.order));
      }
    } catch (error) {
      console.error('Erro ao carregar programas:', error);
      // Fallback em caso de erro
      const defaultPrograms = [
        { id: '1', name: 'Bom dia Tribo', emoji: '🌅', schedule: '6h às 10h', description: 'Acordando com você', isActive: true, order: 1 },
        { id: '2', name: '100% Sertanejo', emoji: '🤠', schedule: '14h às 18h', description: 'O melhor do sertanejo', isActive: true, order: 2 },
        { id: '3', name: 'Tribo Mania', emoji: '🎵', schedule: '18h às 22h', description: 'Hits do momento', isActive: true, order: 3 },
        { id: '4', name: 'Tribo News', emoji: '📰', schedule: 'Toda hora', description: 'Informação atualizada', isActive: true, order: 4 },
      ];
      setPrograms(defaultPrograms);
    }
  };

  return (
    <ul className="space-y-2 text-gray-400">
      {programs.map((program) => (
        <li key={program.id}>
          {program.emoji} {program.name} - {program.schedule}
        </li>
      ))}
    </ul>
  );
}