// Servidor estatico simples para testar o prototipo no celular.
// Sem dependencias: usa so o que vem no Node.
// Uso: node servidor.js   (ou dois cliques em iniciar-servidor.bat)

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORTA = Number(process.argv[2]) || 8080;
const RAIZ = __dirname;

const TIPOS = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

function enderecosDaRede() {
    const saida = [];
    const interfaces = os.networkInterfaces();
    for (const nome of Object.keys(interfaces)) {
        for (const info of interfaces[nome] || []) {
            if (info.family === 'IPv4' && !info.internal) {
                saida.push({ nome, ip: info.address });
            }
        }
    }
    return saida;
}

const servidor = http.createServer((req, res) => {
    let caminho = decodeURIComponent(req.url.split('?')[0]);
    if (caminho === '/' || caminho.endsWith('/')) caminho += 'index.html';

    // Impede sair da pasta do projeto
    const destino = path.join(RAIZ, path.normalize(caminho));
    if (!destino.startsWith(RAIZ)) {
        res.writeHead(403);
        return res.end('403');
    }

    fs.readFile(destino, (erro, conteudo) => {
        const hora = new Date().toLocaleTimeString('pt-BR');
        if (erro) {
            console.log(`  ${hora}  404  ${caminho}`);
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 - nao encontrado: ' + caminho);
        }
        console.log(`  ${hora}  200  ${caminho}`);
        res.writeHead(200, {
            'Content-Type': TIPOS[path.extname(destino).toLowerCase()] || 'application/octet-stream',
            // Sem cache: o celular sempre pega a versao mais recente dos arquivos
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(conteudo);
    });
});

servidor.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('\n  A porta ' + PORTA + ' ja esta em uso.');
        console.log('  Tente outra, por exemplo:  node servidor.js 8081\n');
    } else {
        console.log('\n  Erro ao subir o servidor:', e.message, '\n');
    }
    process.exit(1);
});

servidor.listen(PORTA, '0.0.0.0', () => {
    const redes = enderecosDaRede();
    console.log('\n  Simulador Ademicon no ar.\n');
    console.log('  Neste computador:');
    console.log('     http://localhost:' + PORTA);
    if (redes.length) {
        console.log('\n  No celular (mesmo Wi-Fi), abra um destes:');
        for (const r of redes) {
            console.log('     http://' + r.ip + ':' + PORTA + '   (' + r.nome + ')');
        }
    } else {
        console.log('\n  Nenhuma rede local encontrada - o computador esta conectado ao Wi-Fi?');
    }
    console.log('\n  O cache esta desligado: e so recarregar a pagina para ver as mudancas.');
    console.log('  Para parar o servidor, feche esta janela ou aperte Ctrl+C.\n');
    console.log('  Requisicoes:');
});
