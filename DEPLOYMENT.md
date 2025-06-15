# Guia de Deploy - Rádio Tribo FM

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

A Vercel é a opção mais simples para deploy de aplicações Next.js:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Deploy em produção
vercel --prod
```

**Configuração no Vercel:**
- Adicione as variáveis de ambiente no painel da Vercel
- Configure o MongoDB Atlas ou outro banco remoto
- A aplicação será automaticamente otimizada

### 2. Netlify

```bash
# Build da aplicação
npm run build

# Deploy manual ou configure via Git
# Upload da pasta .next para o Netlify
```

### 3. Docker

Crie um arquivo `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build da imagem
docker build -t radio-tribo-fm .

# Executar container
docker run -p 3000:3000 radio-tribo-fm
```

### 4. Servidor próprio (VPS/Dedicado)

```bash
# No servidor
git clone <seu-repositorio>
cd radio-tribo-moderno

# Instalar dependências
npm install

# Build da aplicação
npm run build

# Instalar PM2 para gerenciamento
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "radio-tribo-fm" -- start

# Configurar startup automático
pm2 startup
pm2 save
```

## 🔧 Configurações Obrigatórias

### Variáveis de Ambiente

Certifique-se de configurar estas variáveis em produção:

```env
# Banco de dados (MongoDB Atlas recomendado)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radio-tribo-fm

# Chave JWT (use uma chave forte)
JWT_SECRET=sua-chave-super-secreta-aqui

# Senha do admin
ADMIN_PASSWORD=sua-senha-admin-segura

# URL do stream de rádio
RADIO_STREAM_URL=https://sua-url-do-stream.com/stream

# RSS Feed
RSS_FEED_URL=https://g1.globo.com/rss/g1/
```

### MongoDB Atlas (Recomendado)

1. Crie uma conta no [MongoDB Atlas](https://cloud.mongodb.com)
2. Crie um cluster gratuito
3. Configure as credenciais de acesso
4. Obtenha a string de conexão
5. Adicione sua IP aos IPs autorizados

### Configuração de Domínio

Se usando domínio próprio:

```bash
# Configure DNS para apontar para seu servidor
# Exemplo: A record para seu-dominio.com -> IP-do-servidor

# Configure SSL com Let's Encrypt (se VPS)
sudo certbot --nginx -d seu-dominio.com
```

## 📊 Monitoramento

### Logs da Aplicação

```bash
# Com PM2
pm2 logs radio-tribo-fm

# Com Docker
docker logs <container-id>
```

### Métricas

Considere adicionar:
- Google Analytics
- Sentry para error tracking
- Uptime monitoring

## 🔒 Segurança

### Checklist de Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados com autenticação
- [ ] SSL/HTTPS configurado
- [ ] Senha admin forte
- [ ] JWT secret seguro
- [ ] Firewall configurado
- [ ] Atualizações regulares

### Backup

Configure backups regulares do MongoDB:

```bash
# Backup manual
mongodump --uri="sua-connection-string" --out=/caminho/backup/

# Restore
mongorestore --uri="sua-connection-string" /caminho/backup/
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com MongoDB**
   - Verifique a string de conexão
   - Confirme IPs autorizados
   - Teste conectividade

2. **Erro 500 na aplicação**
   - Verifique logs da aplicação
   - Confirme todas as env vars
   - Teste build local

3. **CSS não carregando**
   - Verifique build da aplicação
   - Confirme servição de arquivos estáticos

4. **Stream não funcionando**
   - Teste URL do stream
   - Verifique CORS da URL
   - Confirme formato de áudio

### Comandos Úteis

```bash
# Verificar status da aplicação
pm2 status

# Restart da aplicação
pm2 restart radio-tribo-fm

# Ver logs em tempo real
pm2 logs radio-tribo-fm --lines 100

# Monitoramento
pm2 monit
```

## 📈 Otimizações

### Performance

- Configure CDN para assets estáticos
- Ative compressão gzip
- Configure cache headers
- Otimize imagens

### SEO

- Confirme meta tags configuradas
- Adicione sitemap.xml
- Configure robots.txt
- Implemente structured data

### Monitoring

- Configure alertas de uptime
- Monitore performance da aplicação
- Acompanhe métricas de usuário