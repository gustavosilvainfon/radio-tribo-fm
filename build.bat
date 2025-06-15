@echo off
echo Building Radio Tribo FM...
cd /d "C:\Users\gugu_\Workspace\radio_tribo_moderno"
set PATH=%PATH%;C:\Program Files\nodejs

echo Installing dependencies...
npm install

echo Running ESLint...
npm run lint

echo Building application...
npm run build

echo Build completed!
pause