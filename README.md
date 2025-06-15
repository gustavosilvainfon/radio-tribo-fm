# Rádio Tribo FM

Site moderno e interativo para a Rádio Tribo FM, desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🎵 Funcionalidades

- **Player de Rádio ao Vivo**: Stream de áudio com controles de volume e play/pause
- **Top Músicas**: Ranking das 10 músicas mais tocadas (expansível para ranking completo)
- **Chat em Tempo Real**: Sistema de chat interativo com moderação básica
- **Notícias**: Feed de notícias atualizado automaticamente via RSS
- **Painel Administrativo**: Área para gerenciar músicas e configurações
- **Design Responsivo**: Otimizado para desktop e mobile

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB (local ou remoto)

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd radio-tribo-moderno
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Edite o arquivo `.env.local` com suas configurações:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/radio-tribo-fm

# Authentication
JWT_SECRET=seu-jwt-secret-aqui
ADMIN_PASSWORD=sua-senha-admin

# Radio Stream
RADIO_STREAM_URL=https://sua-url-do-stream.com/stream

# RSS Feed
RSS_FEED_URL=https://g1.globo.com/rss/g1/
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB com Mongoose
- **Authentication**: JWT + bcryptjs
- **Real-time**: WebSocket simulation
- **RSS**: rss-parser
- **Icons**: Lucide React

## 📱 Funcionalidades Detalhadas

### Player de Rádio
- Stream de áudio ao vivo
- Controles de play/pause
- Controle de volume
- Indicador visual quando tocando
- Barra fixa na parte inferior

### Top Músicas
- Lista das 10 principais músicas
- Imagens das capas dos álbuns
- Contador de reproduções
- Botão para expandir ranking completo

### Chat Interativo
- Apelidos únicos gerados automaticamente
- Limitação de caracteres (500)
- Proteção contra spam
- Moderação básica com filtro de palavras
- Interface responsiva

### Notícias
- Feed RSS automatizado
- Cache inteligente (1 hora)
- Fallback para notícias mock
- Layout em cards responsivo

### Painel Administrativo
- Autenticação segura
- CRUD completo de músicas
- Upload de imagens
- Gerenciamento de posições no ranking
- Interface intuitiva

## 🔧 Configuração do Stream

Para configurar seu stream de rádio:

1. Obtenha a URL do stream de áudio
2. Adicione no arquivo `.env.local`
3. O player automaticamente utilizará a URL configurada

## 📊 Banco de Dados

O sistema utiliza MongoDB com os seguintes modelos:

- **Songs**: Músicas do ranking
- **ChatMessages**: Mensagens do chat
- **News**: Notícias do RSS
- **Admin**: Usuários administrativos

## 🔐 Área Administrativa

Credenciais padrão:
- **Usuário**: admin
- **Senha**: admin123

Para alterar, modifique a variável `ADMIN_PASSWORD` no `.env.local`

## 🎨 Personalização

### Cores e Tema
Edite o arquivo `tailwind.config.ts` para personalizar as cores.

### Layout
Modifique os componentes em `src/components/` para alterar o layout.

### Funcionalidades
Adicione novas APIs em `src/app/api/` para expandir funcionalidades.

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outros Provedores
```bash
npm run build
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.