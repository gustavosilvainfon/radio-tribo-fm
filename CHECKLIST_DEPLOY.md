# ✅ Checklist de Deploy - Rádio Tribo FM

## 🎯 **OBJETIVO: Site no ar em 30 minutos**

---

### 📋 **ETAPA 1: Preparação (5 min)**
- [ ] ✅ Projeto funcionando localmente
- [ ] 🔧 Executar `deploy-rapido.bat` 
- [ ] 📁 Git inicializado com sucesso

---

### 📋 **ETAPA 2: GitHub (5 min)**
- [ ] 🌐 Conta GitHub criada/logada
- [ ] 📁 Repositório `radio-tribo-fm` criado
- [ ] ⬆️ Código enviado (`git push`)
- [ ] ✅ Código visível no GitHub

**URL do repositório**: `https://github.com/SEU_USUARIO/radio-tribo-fm`

---

### 📋 **ETAPA 3: MongoDB Atlas (10 min)**
- [ ] 🌐 Conta criada em https://cloud.mongodb.com
- [ ] 🗄️ Cluster gratuito criado (`radio-tribo-cluster`)
- [ ] 👤 Usuário criado (`radiotribouser` + senha)
- [ ] 🌍 Acesso liberado (0.0.0.0/0)
- [ ] 📋 Connection string copiada

**Connection String**: 
```
mongodb+srv://radiotribouser:SUA_SENHA@radio-tribo-cluster.xxxxx.mongodb.net/radio-tribo-fm?retryWrites=true&w=majority
```

---

### 📋 **ETAPA 4: Vercel Deploy (10 min)**
- [ ] 🌐 Conta criada em https://vercel.com
- [ ] 🔗 GitHub conectado à Vercel
- [ ] 📁 Projeto `radio-tribo-fm` importado
- [ ] ⚙️ **Environment Variables configuradas**:

```env
MONGODB_URI = [sua connection string]
JWT_SECRET = sua-chave-super-secreta-jwt-producao-2024
ADMIN_PASSWORD = AdminTribo2024!
RSS_FEED_URL = https://tribonewsptga.com.br/feed
RADIO_STREAM_URL = https://sua-url-stream.com/stream
```

- [ ] 🚀 Deploy executado com sucesso
- [ ] ✅ Site acessível na URL da Vercel

**URL do site**: `https://radio-tribo-fm-xxx.vercel.app`

---

### 📋 **ETAPA 5: Testes Finais (5 min)**
- [ ] 🏠 Página inicial carrega
- [ ] 📰 Notícias da Tribo News aparecem
- [ ] 💬 Chat permite enviar mensagens
- [ ] 🔐 Admin acessível (`/admin`)
- [ ] 🎨 Personalização de tema funciona
- [ ] 🎵 Top músicas carrega (dados exemplo)

---

## 🎯 **STATUS ATUAL**

### ✅ **CONCLUÍDO**
- Site desenvolvido
- Todas as funcionalidades implementadas
- Feed configurado para Tribo News
- Painel admin com personalização

### 🔄 **EM ANDAMENTO**
- [ ] Deploy em produção
- [ ] Configuração do banco
- [ ] Testes em produção

### 📋 **PRÓXIMO**
- [ ] Adicionar conteúdo real
- [ ] Configurar stream da rádio
- [ ] Domínio personalizado (opcional)

---

## 🚨 **Se algo der errado...**

### ❌ **Build Failed na Vercel**
1. Verificar logs de erro na Vercel
2. Testar build local: `npm run build`
3. Corrigir erros e fazer novo push

### ❌ **MongoDB não conecta**
1. Verificar connection string
2. Confirmar senha do usuário
3. Verificar IP liberado (0.0.0.0/0)

### ❌ **Environment Variables não funcionam**
1. Verificar se estão em "Production"
2. Sem espaços extras nos valores
3. Redeploy após adicionar

### ❌ **Site não carrega**
1. Verificar domínio na Vercel
2. Aguardar propagação DNS (até 48h)
3. Testar em aba anônima

---

## 📞 **Contatos Úteis**

- **Vercel Support**: https://vercel.com/help
- **MongoDB Support**: https://cloud.mongodb.com/support
- **GitHub Support**: https://support.github.com

---

## 🎉 **APÓS DEPLOY BEM-SUCEDIDO**

Você terá:
- ✅ **Site profissional no ar**
- ✅ **Banco de dados em produção**
- ✅ **Atualizações automáticas via Git**
- ✅ **HTTPS automático**
- ✅ **CDN global**
- ✅ **99.9% uptime**

### 🎯 **Próximos passos após deploy:**
1. **Adicionar músicas reais** via painel admin
2. **Atualizar fotos da equipe** (Santos, João, Daiane)
3. **Configurar stream da rádio**
4. **Personalizar cores** via admin
5. **Testar com a equipe**

**Vamos começar? Execute o `deploy-rapido.bat` e siga o checklist!** 🚀