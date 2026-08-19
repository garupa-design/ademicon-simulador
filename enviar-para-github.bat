@echo off
cd /d "%~dp0"

echo.
echo   === Enviar o simulador para o GitHub ===
echo.

if not exist "index.html" goto :naopasta

where git >nul 2>nul
if errorlevel 1 goto :semgit

rem === Identidade ===
rem Tudo fora de blocos if(): dentro deles o %VAR% e expandido cedo
rem demais e o git acaba recebendo valor vazio.
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
rem Le a URL de verdade: um "origin" pode existir apontando para o vazio.
set REMOTO=
for /f "delims=" %%i in ('git remote get-url origin 2^>nul') do set REMOTO=%%i
if defined REMOTO goto :temremoto

echo.
echo   Cole o endereco do seu repositorio no GitHub.
echo   Exemplo: https://github.com/seu-usuario/ademicon-simulador.git
echo.
set /p URL="  URL: "
if not defined URL goto :semurl
git remote remove origin >nul 2>nul
git remote add origin "%URL%"
set REMOTO=%URL%
:temremoto

echo   Repositorio: %REMOTO%

rem === Commit ===
echo.
echo   Preparando os arquivos...
git add .

git diff --cached --quiet
if errorlevel 1 goto :temmudanca
echo   Nenhum arquivo novo desde o ultimo commit.
goto :enviar

:temmudanca
echo.
set /p MSG="  Descreva o que mudou (Enter para 'Atualiza o simulador'): "
if not defined MSG set MSG=Atualiza o simulador
git commit -m "%MSG%"
if errorlevel 1 goto :commitfalhou

:enviar
rem Sem nenhum commit nao ha o que enviar
git rev-parse HEAD >nul 2>nul
if errorlevel 1 goto :semcommit

echo.
echo   Enviando... (pode abrir o navegador para voce entrar no GitHub)
git push -u origin main
if errorlevel 1 goto :pushfalhou

echo.
echo   Pronto. Os arquivos estao em:
echo   %REMOTO%
goto :fim

:semurl
echo.
echo   Nenhuma URL informada. Rode de novo e cole o endereco.
goto :fim

:semcommit
echo.
echo   Nao existe nenhum commit neste repositorio, entao nao ha o que enviar.
echo   Rode o arquivo de novo e confira se o commit foi feito.
goto :fim

:commitfalhou
echo.
echo   O commit falhou - veja a mensagem do git logo acima.
goto :fim

:pushfalhou
echo.
echo   O envio falhou. Compare com a mensagem do git acima:
echo.
echo   - "does not appear to be a git repository"
echo       A URL do repositorio esta errada ou vazia. Corrija com:
echo           git remote set-url origin URL_DO_SEU_REPOSITORIO
echo.
echo   - "Updates were rejected" ou "fetch first"
echo       O repositorio no GitHub ja tem arquivos. Rode:
echo           git pull --rebase origin main
echo           git push -u origin main
echo.
echo   - "Repository not found" ou pedido de login
echo       Confira se voce tem acesso e se entrou na conta certa.
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
