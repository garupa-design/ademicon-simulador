// Busca de unidades Ademicon - estados > cidades > enderecos > detalhe.
// Extraido do simulador em 2026-08-31 para virar peca reaproveitavel.
// Nao depende do resto do prototipo: so precisa do HTML desta pasta,
// do ../style.css e dos icones em ../assets/.

document.addEventListener('DOMContentLoaded', () => {

        const estados = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

const cidadesFake = {
    'Paraná': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
    'São Paulo': ['São Paulo', 'Campinas', 'Guarulhos', 'Osasco', 'Santos'],
    'Rio de Janeiro': ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias'],
    'default': ['Cidade Centro', 'Cidade Norte', 'Cidade Sul']
};

const enderecosFake = {
    'Curitiba': [
  {
"nome": "Ahú",
"address": "Avenida Anita Garibaldi, 2319, Lj 01, Ahú    CEP: 82200-530",
"phone": "(41) 3019-2211"
  },
  {
"nome": "Alto da XV",
"address": "Rua Mal Deodoro, 1600, Alto da XV   CEP: 80045-090",
"phone": "(41) 3121-2000"
  },
  {
"nome": "Avenida das Torres",
"address": "Avenida Comendador Franco, 3306, Guabirotuba  CEP: 81520-000",
"phone": "(41) 3521-0721"
  },
  {
"nome": "Bacacheri",
"address": "Rua Estados Unidos, 1205, Bacacheri, 82510-050",
"phone": "(41) 3077-7779"
  },
  {
"nome": "Batel I",
"address": "Rua Av. Sete de setembro, 5914 - Batel,  CEP: 80240-000",
"phone": "(41) 3024-3939 |  41 99700-2620"
  },
  {
"nome": "Batel II",
"address": "Av. Sete de setembro, 5863 - Batel, CEP: 80240-001",
"phone": "(41) 3044-1438 | (41) 99127-9999"
  },
  {
"nome": "Cajuru",
"address": "Avenida Vicente de Carvalho, 113, Cajuru  CEP: 82940-370",
"phone": "(41) 3233-4567"
  },
  {
"nome": "Capão Raso",
"address": "R. Marechal Althayr Roszanniy, 1050 - Capão Raso, Curitiba - PR, 81110-350",
"phone": "(41) 99104-3904"
  },
  {
"nome": "Centro",
"address": "Av. Vicente Machado, 1412 - Centro, Curitiba - PR, 80420-011",
"phone": "(41) 99836-0060"
  },
  {
"nome": "Champagnat",
"address": "Edificio Helbor, Rua Padre Anchieta, 2050, Sala 1007, CEP: 80730-000",
"phone": "(41) 3039-7997"
  },
  {
"nome": "Ecoville",
"address": "R. Prof. João Falarz, 1765 - Campo Comprido Ecoville, CEP: 81280-330",
"phone": "(41) 3328-9758"
  },
  {
"nome": "Estação",
"address": " R. Rockefeller, 152 - Rebouças, Curitiba - PR, 80230-130",
"phone": "(41) 99127-9999"
  },
  {
"nome": "Fazendinha",
"address": "R. João Bettega, 1940 - Portão, Curitiba - PR, 81070-462",
"phone": " (41) 98411-6579"
  },
  {
"nome": "Hauer",
"address": "R. Anne Frank, 1915 - Hauer CEP: 81610-020",
"phone": "(41) 3387-1796 "
  },
  {
"nome": "Hugo Lange",
"address": "Rua Augusto Stresser, 1230 - Hugo Lange, Curitiba - PR, 80040-345",
"phone": "(41) 99132-0073"
  },
  {
"nome": "Jardim Social",
"address": "R. Fagundes Varela, 1722 - Loja 09 - Jardim Social, Curitiba - PR, 80530-040",
"phone": "(41) 99849-9354"
  },
  {
"nome": "Juvevê",
"address": "Rua Alberto Bolliger, 700, Juvevê CEP:80030-280",
"phone": "(41) 3353-2003"
  },
  {
"nome": "Kennedy",
"address": "Avenida Presidente Kennedy, 651, Parolin, CEP: 80220-200",
"phone": "(41) 3121-4000"
  },
  {
"nome": "Mercês",
"address": "Rua Brigadeiro Franco, 747, Mercês,  CEP: 80430-210",
"phone": "(41) 3085-2273"
  },
  {
"nome": "Pinheirinho ",
"address": "Rua Valentin Nichele, 215 - Pinheirinho, Curitiba - PR, 81150-310",
"phone": "(41) 99669-9104"
  },
  {
"nome": "Portão",
"address": "Avenida Rep. Argentina, 2557 - Portão   80610-260",
"phone": "(41) 3023-8209"
  },
  {
"nome": "Rebouças",
"address": "Rua Lamenha Lins, 1547, Rebouças  CEP: 80250-020",
"phone": "(41) 3078-5938"
  },
  {
"nome": "Santa Cândida",
"address": "R. Fernando de Noronha, 1089 - Santa Cândida, Curitiba - PR, 82650-145",
"phone": "(41) 98519-9064"
  },
  {
"nome": "Santa Felicidade",
"address": "Avenida Manoel Ribas, 4824, Lj 01, Santa Felicidade  CEP: 82400-000",
"phone": "(41) 3372-2010"
  },
  {
"nome": "Sede Ademicon",
"address": "Av. Sete de Setembro, 5870 - Batel",
"phone": "(41) 3019-2211"
  },
  {
"nome": "Sítio Cercado",
"address": "R. Izaac Ferreira da Cruz, 4615 - Sítio Cercado, Curitiba - PR, 81910-000",
"phone": "(41) 99659-1232"
  },
  {
"nome": "Uberaba",
"address": "Av. Sen. Salgado Filho, 4554 - loja 12B - Uberaba, Curitiba - PR, 81570-001",
"phone": "(41) 99255-9550"
  },
  {
"nome": "Xaxim",
"address": "R. Francisco Derosso, 3073 - Loja 10 - Xaxim, Curitiba - PR, 81720-000",
"phone": "(41) 99689-4208"
  },
  {
"nome": "Água Verde",
"address": "R. Castro, 730 - Loja 03 - Água Verde, Curitiba - PR, 80620-300",
"phone": "(41) 99192-1575"
  }
],
    'default': [
        { nome: 'Unidade Centro', address: 'Rua Principal, 123', phone: '(00) 0000-0000' },
        { nome: 'Unidade Shopping', address: 'Av Comercial, 456', phone: '(00) 1111-2222' }
    ]
};

const allDataFlattened = [];
estados.forEach(estado => {
    allDataFlattened.push({ type: 'estado', label: estado, refEstado: estado });
    
    let cidades = cidadesFake[estado] || cidadesFake['default'];
    cidades.forEach(cidade => {
        allDataFlattened.push({ type: 'cidade', label: cidade, refEstado: estado, refCidade: cidade });
        
        let unidades = enderecosFake[cidade] || enderecosFake['default'];
        unidades.forEach(unidade => {
            allDataFlattened.push({
                type: 'endereco',
                label: unidade.nome,
                refEstado: estado,
                refCidade: cidade,
                address: unidade.address,
                phone: unidade.phone
            });
        });
    });
});

let step4State = 'estados';
let selectedEstado = '';
let selectedCidade = '';
let selectedEndereco = null;
let isGlobalSearch = false;

const breadcrumbCard = document.getElementById('breadcrumbCard');
const breadcrumbTitle = document.getElementById('breadcrumbTitle');
const breadcrumbBack = document.getElementById('breadcrumbBack');
const breadcrumbClose = document.getElementById('breadcrumbClose');

const enderecosTitle = document.getElementById('enderecosTitle');
const searchWrapper = document.getElementById('searchWrapper');
const searchInput = document.getElementById('searchInput');
const enderecosList = document.getElementById('enderecosList');

const mapView = document.getElementById('mapView');
const mapTitle = document.getElementById('mapTitle');
const mapAddress = document.getElementById('mapAddress');
const mapPhone = document.getElementById('mapPhone');
const mapPlaceholderText = document.getElementById('mapPlaceholderText');

function renderList(filter = '') {
    enderecosList.innerHTML = '';
    isGlobalSearch = filter.trim().length > 0;

    let data = [];
    
    if (isGlobalSearch) {
        breadcrumbCard.style.display = 'none';
        enderecosTitle.style.display = 'block';
        enderecosTitle.textContent = 'Resultados da busca';
        mapView.style.display = 'none';
        enderecosList.style.display = 'flex';
        
        data = allDataFlattened.filter(e => e.label.toLowerCase().includes(filter.toLowerCase()));
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'endereco-card';
            let tag = item.type === 'estado' ? 'Estado' : (item.type === 'cidade' ? item.refEstado : item.refCidade);
            
            let inner = '<div style="display: flex; flex-direction: column; gap: 4px;">';
            inner += '<span class="endereco-card-text" style="color: #262626; font-weight: 500;">' + item.label + '</span>';
            inner += '<span class="endereco-card-text" style="font-size: 12px;">' + tag + '</span>';
            inner += '</div><img src="assets/icon-chevron-right.svg" style="width: 16px; height: 16px;">';
            
            card.innerHTML = inner;
            card.addEventListener('click', () => {
                selectedEstado = item.refEstado;
                selectedCidade = item.refCidade || '';
                if (item.type === 'estado') {
                    step4State = 'cidades';
                } else if (item.type === 'cidade') {
                    step4State = 'enderecos';
                } else if (item.type === 'endereco') {
                    selectedEndereco = item;
                    step4State = 'mapa';
                }
                if (searchInput) searchInput.value = '';
                renderList();
            });
            enderecosList.appendChild(card);
        });
        return;
    }

    if (step4State === 'estados') {
        breadcrumbCard.style.display = 'none';
        enderecosTitle.style.display = 'block';
        enderecosTitle.textContent = 'Selecione o Estado';
        searchWrapper.style.display = 'flex';
        enderecosList.style.display = 'flex';
        mapView.style.display = 'none';
        data = estados.map(e => ({ type: 'estado', label: e }));
        
    } else if (step4State === 'cidades') {
        breadcrumbCard.style.display = 'flex';
        breadcrumbBack.style.display = 'none';
        breadcrumbTitle.textContent = selectedEstado;
        enderecosTitle.style.display = 'block';
        enderecosTitle.textContent = 'Selecione a Cidade';
        searchWrapper.style.display = 'flex';
        enderecosList.style.display = 'flex';
        mapView.style.display = 'none';
        const raw = cidadesFake[selectedEstado] || cidadesFake['default'];
        data = raw.map(e => ({ type: 'cidade', label: e }));
        
    } else if (step4State === 'enderecos') {
        breadcrumbCard.style.display = 'flex';
        breadcrumbBack.style.display = 'block';
        breadcrumbTitle.textContent = selectedEstado + ' / ' + selectedCidade;
        enderecosTitle.style.display = 'block';
        enderecosTitle.textContent = 'Selecione a Unidade';
        searchWrapper.style.display = 'flex';
        enderecosList.style.display = 'flex';
        mapView.style.display = 'none';
        const raw = enderecosFake[selectedCidade] || enderecosFake['default'];
        data = raw.map(e => ({ type: 'endereco', label: e.nome, address: e.address, phone: e.phone }));
        
    } else if (step4State === 'mapa') {
        breadcrumbCard.style.display = 'flex';
        breadcrumbBack.style.display = 'block';
        breadcrumbTitle.textContent = selectedEstado + ' / ' + selectedCidade;
        enderecosTitle.style.display = 'none';
        searchWrapper.style.display = 'none';
        enderecosList.style.display = 'none';
        mapView.style.display = 'flex';
        mapTitle.textContent = selectedEndereco.label;
        mapAddress.innerHTML = selectedEndereco.address.replace(/\n/g, '<br>');
        mapPhone.textContent = selectedEndereco.phone;
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'endereco-card';
        
        if (item.type === 'endereco') {
            let inner = '<div style="display: flex; flex-direction: column; gap: 4px;">';
            inner += '<span class="endereco-card-text" style="color: #262626; font-weight: 500;">' + item.label + '</span>';
            inner += '<span class="endereco-card-text" style="font-size: 12px;">' + item.address.split('\n')[0] + '</span>';
            inner += '</div><img src="assets/icon-chevron-right.svg" style="width: 16px; height: 16px;">';
            card.innerHTML = inner;
        } else {
            card.innerHTML = '<span class="endereco-card-text">' + item.label + '</span>';
        }

        card.addEventListener('click', () => {
            if (item.type === 'estado') {
                selectedEstado = item.label;
                step4State = 'cidades';
            } else if (item.type === 'cidade') {
                selectedCidade = item.label;
                step4State = 'enderecos';
            } else if (item.type === 'endereco') {
                selectedEndereco = item;
                step4State = 'mapa';
            }
            if (searchInput) searchInput.value = '';
            renderList();
        });
        enderecosList.appendChild(card);
    });
}

if (breadcrumbBack) {
    breadcrumbBack.addEventListener('click', () => {
        if (step4State === 'mapa') step4State = 'enderecos';
        else if (step4State === 'enderecos') step4State = 'cidades';
        if (searchInput) searchInput.value = '';
        renderList();
    });
}

if (breadcrumbClose) {
    breadcrumbClose.addEventListener('click', () => {
        step4State = 'estados';
        if (searchInput) searchInput.value = '';
        renderList();
    });
}

if (searchInput) {
    const newSearch = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearch, searchInput);
    newSearch.addEventListener('input', (e) => {
        renderList(e.target.value);
    });
}

// Pagina solta: a seta do topo volta para de onde o usuario veio.
// Ao embutir isto num fluxo, troque por quem fecha a tela.
const btnVoltarUnidades = document.getElementById('btnVoltarUnidades');
if (btnVoltarUnidades) {
    btnVoltarUnidades.addEventListener('click', () => history.back());
}

// No simulador quem chamava a primeira renderizacao era a funcao que
// abria a tela. Aqui a tela ja nasce aberta, entao desenha na carga.
renderList();
});
