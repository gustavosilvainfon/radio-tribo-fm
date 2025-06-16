'use client';

import { useState } from 'react';
import { Play, TestTube, CheckCircle, XCircle } from 'lucide-react';

export default function StreamTester() {
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'failed' | 'testing'}>({});
  const [isTesting, setIsTesting] = useState(false);

  const streamUrls = [
    'https://stm21.srvstm.com:6874/stream',
    'https://stm21.srvstm.com:6874/;stream.mp3',
    'https://stm21.srvstm.com:6874/listen.pls',
    'http://stm21.srvstm.com:6874/stream',
    'https://api.allorigins.win/raw?url=https://stm21.srvstm.com:6874/stream',
  ];

  const testStream = async (url: string) => {
    setTestResults(prev => ({ ...prev, [url]: 'testing' }));
    
    try {
      const audio = new Audio();
      
      return new Promise<'success' | 'failed'>((resolve) => {
        const timeout = setTimeout(() => {
          audio.src = '';
          resolve('failed');
        }, 10000); // 10 second timeout

        audio.oncanplay = () => {
          clearTimeout(timeout);
          audio.src = '';
          resolve('success');
        };

        audio.onerror = () => {
          clearTimeout(timeout);
          audio.src = '';
          resolve('failed');
        };

        audio.crossOrigin = 'anonymous';
        audio.preload = 'metadata';
        audio.src = url;
        audio.load();
      });
    } catch (error) {
      return 'failed';
    }
  };

  const testAllStreams = async () => {
    setIsTesting(true);
    setTestResults({});

    for (const url of streamUrls) {
      const result = await testStream(url);
      setTestResults(prev => ({ ...prev, [url]: result }));
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: 'success' | 'failed' | 'testing' | undefined) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <TestTube className="w-5 h-5" />
          <span>Teste de Conectividade do Stream</span>
        </h3>
        <button
          onClick={testAllStreams}
          disabled={isTesting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <TestTube className="w-4 h-4" />
          <span>{isTesting ? 'Testando...' : 'Testar Streams'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {streamUrls.map((url) => (
          <div key={url} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            {getStatusIcon(testResults[url])}
            <div className="flex-grow">
              <code className="text-sm text-gray-300 break-all">{url}</code>
            </div>
            {testResults[url] === 'success' && (
              <button
                onClick={() => {
                  const audio = new Audio(url);
                  audio.crossOrigin = 'anonymous';
                  audio.play().catch(console.error);
                }}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                title="Testar reprodução"
              >
                <Play className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Instruções:</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>1. Clique em "Testar Streams" para verificar conectividade</p>
          <p>2. URLs com ✅ estão funcionais</p>
          <p>3. Use o botão ▶️ para testar reprodução das URLs funcionais</p>
          <p>4. Configure a URL que funcionar no painel admin</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded">
        <p className="text-blue-300 text-sm">
          <strong>Dica:</strong> Se nenhuma URL funcionar, pode ser problema de CORS ou o stream estar offline. 
          Contate seu provedor de streaming para verificar a configuração.
        </p>
      </div>
    </div>
  );
}