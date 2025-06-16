# 📥 Como Instalar Git no Windows

## Opção 1: Git for Windows (Recomendado)

### 1. Download
- Acesse: https://git-scm.com/download/win
- Baixe a versão mais recente (64-bit)

### 2. Instalação
1. Execute o arquivo `.exe` baixado
2. Aceite as configurações padrão (clique "Next" em tudo)
3. **IMPORTANTE**: Deixe marcado "Git Bash Here" e "Git GUI Here"

### 3. Verificar Instalação
Abra o **Prompt de Comando** ou **PowerShell** e digite:
```bash
git --version
```

Deve mostrar algo como: `git version 2.42.0.windows.1`

## Opção 2: GitHub Desktop (Mais Fácil)

### Para quem prefere interface gráfica

1. **Download**: https://desktop.github.com/
2. **Instalar** e fazer login com conta GitHub
3. **Clone** ou **Add Local Repository**

## 🚀 Primeiro Upload do Projeto

### 1. Abrir Terminal no Projeto
```bash
# Navegar para a pasta do projeto
cd "C:\Users\gugu_\Workspace\radio_tribo_moderno"
```

### 2. Inicializar Git
```bash
git init
git add .
git commit -m "🎵 Rádio Tribo FM - Sistema completo v2.0"
```

### 3. Criar Repositório no GitHub
1. Ir para: https://github.com/new
2. Nome: `radio-tribo-fm`
3. Descrição: `Sistema completo de rádio online`
4. Deixar **Público** (ou Privado se preferir)
5. **NÃO** marcar "Add README" (já temos)
6. Clicar **"Create repository"**

### 4. Conectar e Enviar
```bash
# Substituir SEU-USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU-USUARIO/radio-tribo-fm.git
git branch -M main
git push -u origin main
```

## 🔧 Solução de Problemas

### Git não é reconhecido
- **Solução**: Reiniciar o terminal após instalação
- **Alternativa**: Adicionar Git ao PATH manualmente

### Erro de autenticação
```bash
# Configurar usuário
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Erro de push
- **GitHub Token**: Pode precisar de token pessoal
- **Alternativa**: Usar GitHub Desktop

## 📱 GitHub Desktop - Processo Simples

### 1. Instalar GitHub Desktop
- Download: https://desktop.github.com/
- Instalar e fazer login

### 2. Adicionar Projeto
1. File → "Add Local Repository"
2. Escolher pasta: `C:\Users\gugu_\Workspace\radio_tribo_moderno`
3. "Create Repository"

### 3. Primeiro Commit
1. Escrever mensagem: "🎵 Rádio Tribo FM - Sistema completo"
2. Clicar "Commit to main"
3. Clicar "Publish repository"

### 4. Configurar Repositório
- Nome: `radio-tribo-fm`
- Descrição: `Sistema completo de rádio online`
- Escolher Público/Privado
- Clicar "Publish Repository"

## ✅ Verificar se Funcionou

1. **GitHub Web**: Ver se arquivos apareceram online
2. **Clone Test**: Tentar clonar em outra pasta
```bash
git clone https://github.com/SEU-USUARIO/radio-tribo-fm.git
```

## 🚀 Próximo Passo: Deploy

Após upload no GitHub:

### Vercel Deploy
1. Acessar: https://vercel.com
2. "Import Project"
3. Conectar repositório GitHub
4. Configurar variáveis de ambiente
5. Deploy!

### Netlify Deploy
1. Acessar: https://netlify.com
2. Drag & Drop ou conectar GitHub
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy!

---

**🎯 Escolha uma opção e siga o passo a passo!**

- **Fácil**: GitHub Desktop (interface gráfica)
- **Profissional**: Git command line
- **Sem Git**: Upload manual via interface web do GitHub