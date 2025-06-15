# 🚀 Deploy Completo - Rádio Tribo FM

## 🎯 Estratégia: Vercel + MongoDB Atlas (100% Gratuito)

### ⚡ **Opção Recomendada: Deploy Rápido (30 minutos)**

---

## 📋 **PASSO A PASSO COMPLETO**

### 1️⃣ **Preparar Projeto para Deploy**

Primeiro, vamos criar um repositório Git:

```bash
# No terminal do projeto:
cd "C:\Users\gugu_\Workspace\radio_tribo_moderno"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "🎵 Projeto inicial Rádio Tribo FM"
```

### 2️⃣ **Criar Repositório no GitHub**

1. Acesse https://github.com
2. Clique "New repository"
3. Nome: `radio-tribo-fm`
4. Deixe público
5. **NÃO** marque "Initialize with README"
6. Clique "Create repository"

```bash
# Conectar com GitHub (substituir pela sua URL):
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/radio-tribo-fm.git
git push -u origin main
```

### 3️⃣ **Configurar MongoDB Atlas**

1. **Criar conta**: https://cloud.mongodb.com
2. **Criar cluster gratuito**:
   - Build a Database → M0 Sandbox (FREE)
   - Região: São Paulo ou mais próxima
   - Nome: `radio-tribo-cluster`

3. **Configurar acesso**:
   - **Database Access**: 
     - Username: `radiotribouser`
     - Password: Gere uma senha forte e SALVE!
     - Privileges: "Read and write to any database"
   
   - **Network Access**: 
     - "Allow access from anywhere" (0.0.0.0/0)

4. **Obter Connection String**:
   ```
   mongodb+srv://radiotribouser:SUA_SENHA@radio-tribo-cluster.xxxxx.mongodb.net/radio-tribo-fm?retryWrites=true&w=majority
   ```

### 4️⃣ **Deploy na Vercel**

1. **Criar conta**: https://vercel.com
2. **Conectar GitHub**: 
   - "Continue with GitHub"
   - Autorizar acesso aos repositórios

3. **Importar projeto**:
   - "Add New" → "Project"
   - Selecionar `radio-tribo-fm`
   - Framework: Next.js (detecta automaticamente)

4. **Configurar Environment Variables**:
   
   Antes de fazer deploy, clique "Environment Variables" e adicione:

   ```env
   # Database
   MONGODB_URI = mongodb+srv://radiotribouser:SUA_SENHA@radio-tribo-cluster.xxxxx.mongodb.net/radio-tribo-fm?retryWrites=true&w=majority

   # Authentication  
   JWT_SECRET = sua-chave-super-secreta-jwt-producao-2024
   ADMIN_PASSWORD = AdminTribo2024!

   # RSS Feed (já configurado)
   RSS_FEED_URL = https://tribonewsptga.com.br/feed

   # Stream (configurar depois)
   RADIO_STREAM_URL = https://sua-url-do-stream.com:porta/stream
   ```

5. **Deploy**:
   - Clique "Deploy"
   - Aguarde build (2-3 minutos)
   - ✅ **Site no ar!**

### 5️⃣ **Testar Site em Produção**

Sua URL será algo como: `https://radio-tribo-fm-xxx.vercel.app`

**Testes a fazer**:
- ✅ Site carrega normalmente
- ✅ Feed de notícias da Tribo News funciona
- ✅ Chat permite enviar mensagens
- ✅ Admin funciona: `sua-url.vercel.app/admin`
- ✅ Personalização de tema salva
- ✅ Top músicas carrega (dados de exemplo)

### 6️⃣ **Popular Banco com Dados**

**Opção A: Via Painel Admin** (Recomendado)
1. Acesse `/admin` no seu site
2. Login: `admin` / `AdminTribo2024!`
3. Adicione músicas manualmente via formulário

**Opção B: Via Script Local**
```bash
# Localmente, com a URL do MongoDB Atlas:
npm run seed
```

---

## 🎯 **Configurações Pós-Deploy**

### 🌐 **Configurar Domínio Personalizado**

1. **Registrar domínio** (ex: radiotribofm.com.br)
2. **Na Vercel**:
   - Project Settings → Domains
   - Add Domain → Seu domínio
   - Configurar DNS conforme instruções

### 📻 **Configurar Stream de Rádio**

1. **Contratar streaming** (ex: Centova Cast, Shoutcast)
2. **Obter URL do stream**
3. **Atualizar na Vercel**:
   - Project Settings → Environment Variables
   - Edit `RADIO_STREAM_URL`
   - Redeploy automático

### 📊 **Configurar Analytics**

Adicionar no `layout.tsx`:
```typescript
// Google Analytics
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" />
```

---

## 🔄 **Workflow de Atualizações**

Para atualizar o site:
```bash
# Fazer mudanças no código
git add .
git commit -m "🔧 Sua atualização"
git push

# Vercel faz deploy automático!
```

---

## 🎨 **Customizações Específicas para Tribo FM**

### Atualizar Informações da Equipe
Edite `src/components/Team.tsx`:
- Substitua URLs das fotos por fotos reais
- Atualize horários dos programas
- Personalize descrições

### Configurar Promoções Reais
Edite `src/components/Promotions.tsx`:
- Atualize prêmios e datas
- Configure telefones/WhatsApp reais
- Personalize regulamento

### Adicionar Clientes nos Banners
Edite `src/components/AdBanner.tsx`:
- Substitua por anúncios reais
- Configure links para clientes
- Atualize imagens e textos

---

## 🚨 **Solução de Problemas Comuns**

### Build Failed
```bash
# Localmente, teste build:
npm run build
# Corrija erros e faça novo push
```

### Environment Variables não funcionam
- Verifique se não tem espaços extras
- Certifique-se que estão em "Production"
- Faça redeploy após adicionar

### Banco não conecta
- Teste connection string localmente
- Verifique se liberou todos os IPs no MongoDB Atlas
- Confirme username/password corretos

---

## ✅ **Checklist Final**

### Antes do Deploy:
- [ ] Código commitado no GitHub
- [ ] MongoDB Atlas configurado
- [ ] Environment variables preparadas

### Durante Deploy:
- [ ] Vercel conectado ao GitHub
- [ ] Environment variables adicionadas
- [ ] Build executado com sucesso

### Após Deploy:
- [ ] Site acessível na URL da Vercel
- [ ] Admin funciona (/admin)
- [ ] Banco de dados conectado
- [ ] Feed de notícias carregando
- [ ] Personalização de tema salvando

### Próximos Passos:
- [ ] Domínio personalizado (opcional)
- [ ] Stream de rádio configurado
- [ ] Conteúdo real adicionado
- [ ] Analytics configurado

---

## 🎯 **URLs Importantes**

Após deploy, você terá:
- **Site**: `https://radio-tribo-fm-xxx.vercel.app`
- **Admin**: `https://radio-tribo-fm-xxx.vercel.app/admin`
- **GitHub**: `https://github.com/seu-usuario/radio-tribo-fm`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **MongoDB Atlas**: `https://cloud.mongodb.com`

---

## 🚀 **Vantagens desta Configuração**

✅ **Gratuito** (MongoDB Atlas + Vercel)
✅ **Automático** (Deploy via Git)
✅ **Escalável** (Cresce conforme necessidade)
✅ **Seguro** (HTTPS automático)
✅ **Rápido** (CDN global da Vercel)
✅ **Confiável** (99.9% uptime)

**Pronto para começar? Qual passo você gostaria de fazer primeiro?** 🎯