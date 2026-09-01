# Busca de unidades

Peça isolada, tirada do simulador em 31/08/2026 quando a etapa do mapa saiu do
fluxo de contratação. Continua funcionando sozinha, para ser reaproveitada em
outra parte do site.

## Como abrir

`unidades/index.html` — direto no navegador ou pelo `iniciar-servidor.bat` da
raiz, em `http://localhost:8080/unidades/`.

## O que ela faz

Navegação em quatro níveis, um card só trocando de conteúdo:

1. **Selecione o Estado** — lista os 27 estados.
2. **Cidades** — cidades daquele estado.
3. **Endereços** — unidades daquela cidade.
4. **Detalhe** — nome, endereço, telefone e a imagem do mapa.

A trilha no topo (`breadcrumbCard`) aparece a partir do nível 2: a seta volta um
nível, o X volta para a lista de estados.

O campo de busca filtra **os três níveis ao mesmo tempo** — digitar "Curitiba"
acha a cidade, digitar "Batel" acha a unidade, sem precisar navegar até lá.
Enquanto há texto no campo, a trilha some e o título vira "Resultados da busca".

## Arquivos

- `index.html` — a tela.
- `unidades.js` — dados e comportamento. Um `DOMContentLoaded` só.
- Estilos vêm de `../style.css` (classes `.step4-*`, `.search-wrapper`,
  `.enderecos-list`). Ícones vêm de `../assets/`.

**Se esta pasta for movida para outro projeto**, leve junto: as classes acima do
`style.css`, as fontes Axiforma de `assets/tipografia/`, e os ícones
`icon-arrow-left.svg`, `icon-close.svg`, `icon-search.svg` e `map-image.png`.

## O dado é falso

`estados`, `cidadesFake` e `enderecosFake`, no topo do `unidades.js`, são de
teste. Só Curitiba tem endereços reais — o resto cai no `default`. A lista
original bruta estava em `curitiba_stores.json`, hoje na pasta `deletar/`.

O mapa não é mapa: é a imagem estática `assets/map-image.png`, igual para toda
unidade. Trocar por um mapa de verdade (Google Maps embed ou Leaflet) é o
próximo passo natural se a peça for para produção.

## Ao integrar

O `unidades.js` assume que a tela já nasce visível e chama `renderList()` na
carga. Se for embutir num fluxo onde a tela abre por um clique, tire essa
chamada do fim do arquivo e chame `renderList()` no momento em que a tela
aparecer — foi assim que ela funcionava dentro do simulador.
