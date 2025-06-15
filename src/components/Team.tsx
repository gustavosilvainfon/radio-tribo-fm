'use client';

import { Users, Mic, Clock, Heart } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  {
    id: 1,
    name: 'Santos Águia',
    role: 'Locutor 100% Sertanejo',
    description: 'Especialista em música sertaneja, Santos traz o melhor do country e sertanejo universitário para você.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face=center',
    schedule: 'Segunda a Sexta - 14h às 18h',
    specialty: 'Sertanejo & Country',
    icon: '🤠',
  },
  {
    id: 2,
    name: 'João Lopes',
    role: 'Locutor Tribo News e Bom dia Tribo',
    description: 'Jornalista experiente, João mantém você informado com as principais notícias e um bom dia especial.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face=center',
    schedule: 'Segunda a Sexta - 6h às 10h',
    specialty: 'Jornalismo & Informação',
    icon: '📰',
  },
  {
    id: 3,
    name: 'Daiane Santos',
    role: 'Locutora Tribo Mania',
    description: 'Com energia contagiante, Daiane anima suas tardes com os maiores sucessos e muita descontração.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&face=center',
    schedule: 'Segunda a Sexta - 18h às 22h',
    specialty: 'Pop & Hits',
    icon: '🎵',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-white">Nossa Equipe</h2>
          </div>
          <p className="text-gray-400 text-lg">
            Conheça os profissionais que fazem a Rádio Tribo FM acontecer todos os dias
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors duration-300 group"
            >
              <div className="relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/300x300/374151/ffffff?text=${member.icon}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-blue-400 font-medium">
                        {member.specialty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>

                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{member.schedule}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      AO VIVO
                    </span>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 rounded-full text-white">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Equipe dedicada 24/7 para você!</span>
          </div>
        </div>
      </div>
    </section>
  );
}