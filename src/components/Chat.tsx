'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Users } from 'lucide-react';
import { ChatMessage } from '@/types';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate a random username if not set
    if (!username) {
      const adjectives = ['Cool', 'Super', 'Mega', 'Ultra', 'Happy', 'Smart', 'Fast', 'Strong'];
      const nouns = ['Listener', 'Fan', 'Music', 'Radio', 'Sound', 'Beat', 'Vibe', 'Wave'];
      const randomUsername = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
      setUsername(randomUsername);
    }
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simulate WebSocket connection
    setIsConnected(true);
    setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    
    // Load initial messages
    loadMessages();

    // Simulate receiving messages (less frequent to avoid scroll issues)
    const interval = setInterval(() => {
      const randomMessages = [
        'Adorando essa música! 🎵',
        'Qual é essa música tocando agora?',
        'Rádio Tribo FM é demais! 🔥',
        'Alguém sabe o nome do artista?',
        'Top demais essa playlist!',
        'Ouvindo no trabalho 💪',
        'Essa rádio anima meu dia!',
      ];
      
      const randomUsernames = [
        'MusicLover123', 'RadioFan456', 'SoundWave789', 'BeatMaster', 'VibeChecker',
        'MelodyHunter', 'RhythmKing', 'AudioPhile', 'TuneSeeker', 'BassHead'
      ];

      if (Math.random() > 0.85) { // 15% chance to receive a message (less frequent)
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
        };
        setMessages(prev => {
          const newMessages = [...prev.slice(-49), newMsg];
          return newMessages;
        });
      }
    }, 15000); // Increased to 15 seconds

    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        setMessages(prev => [...prev.slice(-49), message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section id="chat" className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <h2 className="text-3xl font-bold">Chat da Rádio</h2>
            </div>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{onlineUsers} online</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="h-96 overflow-y-auto p-4 space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Seja o primeiro a enviar uma mensagem!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="fade-in-up">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-blue-400 text-sm">
                            {message.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-200 break-words">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-700 p-4">
              <form onSubmit={sendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  maxLength={500}
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Logado como: <strong className="text-blue-400">{username}</strong></span>
                <span>{newMessage.length}/500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}