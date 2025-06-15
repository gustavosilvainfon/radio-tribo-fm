# 🗄️ Configurar Banco de Dados - MongoDB Atlas (GRATUITO)

## 🚀 Configuração Rápida (15 minutos)

### Passo 1: Criar Conta MongoDB Atlas
1. Acesse: https://cloud.mongodb.com
2. Clique em "Try Free"
3. Cadastre-se com seu e-mail
4. Verifique o e-mail

### Passo 2: Criar Cluster Gratuito
1. Escolha "Build a Database"
2. Selecione "M0 Sandbox" (GRATUITO)
3. Escolha região mais próxima (São Paulo se disponível)
4. Nome do cluster: "radio-tribo-cluster"
5. Clique "Create Cluster"

### Passo 3: Configurar Acesso
1. **Database Access**:
   - Clique "Add New Database User"
   - Username: `radiotribouser`
   - Password: Gere uma senha segura (salve ela!)
   - Database User Privileges: "Read and write to any database"
   - Clique "Add User"

2. **Network Access**:
   - Clique "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique "Confirm"

### Passo 4: Obter String de Conexão
1. Volte para "Database"
2. Clique "Connect" no seu cluster
3. Escolha "Drivers"
4. Selecione "Node.js" versão 4.1 ou later
5. Copie a connection string (algo como):
```
mongodb+srv://radiotribouser:<password>@radio-tribo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Passo 5: Atualizar Projeto
1. Abra o arquivo `.env.local`
2. Substitua a linha do MONGODB_URI:
```env
MONGODB_URI=mongodb+srv://radiotribouser:SUA_SENHA_AQUI@radio-tribo-cluster.xxxxx.mongodb.net/radio-tribo-fm?retryWrites=true&w=majority
```

### Passo 6: Testar Conexão
```bash
# Pare o servidor se estiver rodando (Ctrl+C)
# Reinicie o servidor
npm run dev
```

## ✅ Verificar se Funcionou

Acesse http://localhost:3000 e verifique:
- ✅ Top Músicas carregam (dados de exemplo)
- ✅ Chat funciona sem erros
- ✅ Notícias carregam do feed da Tribo News
- ✅ Painel admin (/admin) funciona

## 🔄 Popular com Dados Iniciais

Depois que o banco estiver conectado:
```bash
npm run seed
```

Isso vai adicionar 10 músicas de exemplo no ranking.

## 🚨 Troubleshooting

### Erro: "MongooseServerSelectionError"
- ✅ Verifique se copiou a string de conexão correta
- ✅ Confirme que substituiu `<password>` pela senha real
- ✅ Verifique se liberou acesso de qualquer IP (0.0.0.0/0)

### Erro: "Authentication failed"
- ✅ Confira username e senha do usuário do banco
- ✅ Verifique se deu permissão "Read and write to any database"

### Site ainda mostra dados mock
- ✅ Reinicie o servidor após alterar .env.local
- ✅ Execute `npm run seed` para popular com dados
- ✅ Limpe cache do navegador (Ctrl+F5)

## 📱 Alternativa Rápida: Banco Local

Se preferir testar sem configurar nada:

### Windows:
1. Baixe MongoDB Community: https://www.mongodb.com/try/download/community
2. Instale com configurações padrão
3. O site já está configurado para funcionar localmente

### O que acontece sem banco:
- ✅ Site funciona normalmente
- ✅ Usa dados de exemplo (mock)
- ❌ Não salva alterações do admin
- ❌ Chat não persiste mensagens

---

## 🎯 Próximo Passo Depois do Banco

Após configurar o banco de dados:

1. **Testar todas as funcionalidades**
2. **Adicionar músicas reais via painel admin**
3. **Configurar o stream de rádio**
4. **Fazer deploy em produção**

**Pronto para configurar o banco? É bem simples e gratuito! 🚀**