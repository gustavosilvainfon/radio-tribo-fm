@echo off
echo 🚀 Deploy Rápido - Rádio Tribo FM
echo.

cd /d "C:\Users\gugu_\Workspace\radio_tribo_moderno"

echo 📦 Verificando se Git está instalado...
git --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não está instalado. Instale em: https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git encontrado!
echo.

echo 🔧 Inicializando repositório Git...
git init

echo 📁 Adicionando arquivos...
git add .

echo 💾 Fazendo commit inicial...
git commit -m "🎵 Projeto inicial Rádio Tribo FM - Deploy para produção"

echo.
echo 🎯 PRÓXIMOS PASSOS:
echo.
echo 1. Criar repositório no GitHub:
echo    - Acesse: https://github.com/new
echo    - Nome: radio-tribo-fm
echo    - Deixe público
echo    - NÃO marque "Initialize with README"
echo.
echo 2. Após criar, execute estes comandos:
echo    git branch -M main
echo    git remote add origin https://github.com/SEU_USUARIO/radio-tribo-fm.git
echo    git push -u origin main
echo.
echo 3. Deploy na Vercel:
echo    - Acesse: https://vercel.com
echo    - Conecte com GitHub
echo    - Importe o projeto radio-tribo-fm
echo.
echo 4. Configure as variáveis de ambiente conforme DEPLOY_COMPLETO.md
echo.

pause