@echo off
cd /d "%~dp0"

echo.
echo   === Enviar o simulador para o GitHub ===
echo.

if not exist "index.html" goto :naopasta

where git >nul 2>nul
if errorlevel 1 goto :semgit

rem === Identidade ===
rem Fora de blocos if(): dentro deles o %VAR% e expandido cedo demais
rem e o git recebe valor vazio.
git config --global user.name >nul 2>nul
if not errorlevel 1 goto :temnome
echo.
set /p NOME="  Seu nome (aparece nos commits): "
git config --global user.name "%NOME%"
:temnome

git config --global user.email >nul 2>nul
if not errorlevel 1 goto :tememail
set /p EMAIL="  Seu e-mail do GitHub: "
git config --global user.email "%EMAIL%"
:tememail

echo   Identidade:
for /f "delims=" %%i in ('git config --global user.name') do echo      nome:   %%i
for /f "delims=" %%i in ('git config --global user.email') do echo      e-mail: %%i

rem === Repositorio local ===
if exist ".git" goto :temrepo
echo.
echo   Criando o repositorio local...
git init
git branch -M main
:temrepo

rem === Endereco remoto ===
git remote get-url origin >nul 2>nul
if not errorlevel 1 goto :temremoto
echo.
echo   Cole o endereco do seu repositorio no GitHub.
echo   Exemplo: https://github.com/seu-usuario/ademicon-simulador.git
echo.
set /p URL="  URL: "
git remote add origin "%URL%"
:temremoto

echo.
echo   Preparando os arquivos...
git add .

git diff --cached --quiet
if not errorlevel 1 goto :semmudanca

echo.
set /p MSG="  Descreva o que mudou (Enter para 'Atualiza o simulador'): "
if not defined MSG set MSG=Atualiza o simulador
git commit -m "%MSG%"
if errorlevel 1 goto :commitfalhou
goto :enviar

:semmudanca
rem Sem mudancas agora, mas pode haver commits ainda nao enviados
git log origin/main..HEAD --oneline >nul 2>nul
echo   Nada mudou desde o ultimo commit. Tentando enviar o que houver...

:enviar
echo.
echo   Enviando... (pode abrir o navegador para voce entrar no GitHub)
git push -u origin main
if errorlevel 1 goto :pushfalhou

echo.
echo   Pronto. Os arquivos estao no GitHub.
goto :fim

:commitfalhou
echo.
echo   O commit falhou - veja a mensagem do git acima.
echo   Sem commit nao ha o que enviar.
goto :fim

:pushfalhou
echo.
echo   O envio falhou. Veja a mensagem do git acima:
echo.
echo   - "src refspec main does not match any"
echo       Nao existe nenhum commit. Provavelmente o commit falhou antes.
echo.
echo   - "Updates were rejected" ou "fetch first"
echo       O repositorio no GitHub ja tem arquivos. Rode:
echo           git pull --rebase origin main
echo           git push -u origin main
echo.
echo   - "Repository not found" ou pedido de login
echo       Confira a URL e se voce entrou na conta certa do GitHub.
echo.
goto :fim

:naopasta
echo   ERRO: rode este arquivo de dentro da pasta ademicon-simulador.
goto :fim

:semgit
echo   O Git nao esta instalado.
echo.
echo   Baixe em: https://git-scm.com/download/win
echo   Instale com as opcoes padrao, feche esta janela e rode de novo.

:fim
echo.
pause
