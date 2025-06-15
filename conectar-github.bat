@echo off
echo 🚀 Conectando com GitHub - Rádio Tribo FM
echo.

cd /d "C:\Users\gugu_\Workspace\radio_tribo_moderno"

echo 📋 INSTRUÇÕES:
echo.
echo 1. Crie o repositório no GitHub com o nome: radio-tribo-fm
echo 2. Substitua SEU_USUARIO pela sua conta do GitHub no comando abaixo
echo 3. Execute os comandos:
echo.

echo 🔗 COMANDOS PARA EXECUTAR:
echo.
echo "C:\Program Files\Git\bin\git.exe" branch -M main
echo "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/SEU_USUARIO/radio-tribo-fm.git
echo "C:\Program Files\Git\bin\git.exe" push -u origin main
echo.

echo 💡 EXEMPLO (substitua SEU_USUARIO):
echo "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/joaosilva/radio-tribo-fm.git
echo.

echo ⚠️  IMPORTANTE: Substitua SEU_USUARIO pelo seu usuário real do GitHub!
echo.

pause