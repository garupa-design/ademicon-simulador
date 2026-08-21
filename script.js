document.addEventListener('DOMContentLoaded', () => { try {
    // === Dropdown Produto ===
    const produtoSelectBtn = document.getElementById('produtoSelectBtn');
    const produtoDropdown = document.getElementById('produtoDropdown');
    const produtoText = document.getElementById('produtoText');
    const produtoIcon = document.getElementById('produtoIcon');
    const produtoChevron = document.getElementById('produtoChevron');

    // Toggle dropdown
    produtoSelectBtn.addEventListener('click', () => {
        const isVisible = produtoDropdown.style.display === 'block';
        produtoDropdown.style.display = isVisible ? 'none' : 'block';
        produtoChevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        if(isVisible) {
            produtoSelectBtn.classList.remove('active-state');
        } else {
            produtoSelectBtn.classList.add('active-state');
        }
    });

    // Select option
    produtoDropdown.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            produtoText.textContent = item.textContent.trim();
            
            // Opcional: Atualizar ícone se tivermos os SVGs de veículo/serviço. 
            // Por enquanto deixo a lógica pronta usando data-icon.
            const newIconSrc = item.getAttribute('data-icon');
            if(newIconSrc) {
                // Como não baixamos todos, só altera se existir ou fallback pro home pra não quebrar a imagem
                produtoIcon.src = newIconSrc; 
            }

            produtoDropdown.style.display = 'none';
            produtoChevron.style.transform = 'rotate(0deg)';
            produtoSelectBtn.classList.remove('active-state');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!produtoSelectBtn.contains(e.target) && !produtoDropdown.contains(e.target)) {
            produtoDropdown.style.display = 'none';
            produtoChevron.style.transform = 'rotate(0deg)';
            produtoSelectBtn.classList.remove('active-state');
        }
    });

    // === Toggle Crédito/Parcela ===
    const btnCredito = document.getElementById('btnCredito');
    const btnParcela = document.getElementById('btnParcela');
    const labelValor = document.getElementById('labelValor');
    const inputValor = document.getElementById('inputValor');

    function setActiveToggle(activeBtn, inactiveBtn) {
        activeBtn.classList.remove('toggle-btn-inactive');
        activeBtn.classList.add('toggle-btn-active');
        
        inactiveBtn.classList.remove('toggle-btn-active');
        inactiveBtn.classList.add('toggle-btn-inactive');
    }

    btnCredito.addEventListener('click', () => {
        setActiveToggle(btnCredito, btnParcela);
        labelValor.textContent = 'Valor do crédito';
        inputValor.placeholder = 'R$ 100.000,00';
    });

    btnParcela.addEventListener('click', () => {
        setActiveToggle(btnParcela, btnCredito);
        labelValor.textContent = 'Valor da parcela';
        inputValor.placeholder = 'R$ 10.000,00';
    });

    // === Máscara de Moeda Simples ===
    inputValor.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        
        if (value.length === 0) {
            e.target.value = '';
            return;
        }

        // Divide por 100 para ter os centavos
        value = (parseInt(value) / 100).toFixed(2);
        
        // Formata para pt-BR
        value = value.replace('.', ',');
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        
        e.target.value = 'R$ ' + value;
    });

    // Botão simular (Troca de tela)
    const btnSimular = document.getElementById('btnSimular');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    btnSimular.addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'flex'; // Usando flex conforme definido no css step2-content
        window.scrollTo(0, 0); // Volta pro topo
    });

    // Quando o usuario chega numa tela vindo da revisao, o botao vira
    // "Salvar alteracao" e o retorno e para a revisao, nao para a proxima etapa.
    let modoEdicao = false;

    // === Máscaras de CPF e Telefone ===
    // Montadas por fatiamento, sem grupos de captura ($1, $2...) de proposito:
    // esse padrao ja foi corrompido pelos scripts de regex antigos do projeto.

    function mascaraCPF(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 11);
        let saida = d.slice(0, 3);
        if (d.length > 3) saida += '.' + d.slice(3, 6);
        if (d.length > 6) saida += '.' + d.slice(6, 9);
        if (d.length > 9) saida += '-' + d.slice(9, 11);
        return saida;
    }

    function mascaraTelefone(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 11);
        if (d.length === 0) return '';
        if (d.length <= 2) return '(' + d;
        // 11 digitos = celular (5 antes do traco); 10 = fixo (4 antes)
        const corte = d.length > 10 ? 7 : 6;
        let saida = '(' + d.slice(0, 2) + ') ' + d.slice(2, corte);
        if (d.length > corte) saida += '-' + d.slice(corte);
        return saida;
    }

    // Reaplica a mascara a cada tecla e devolve o cursor para depois
    // do mesmo digito em que ele estava, para nao pular para o fim.
    function aplicarMascara(input, formatar) {
        if (!input) return;
        input.addEventListener('input', () => {
            const posicao = input.selectionStart;
            const digitosAntesDoCursor = input.value.slice(0, posicao).replace(/\D/g, '').length;
            const formatado = formatar(input.value);
            input.value = formatado;

            let i = 0;
            let contados = 0;
            while (i < formatado.length && contados < digitosAntesDoCursor) {
                if (formatado[i] >= '0' && formatado[i] <= '9') contados++;
                i++;
            }
            input.setSelectionRange(i, i);
        });
    }

    function mascaraData(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 8);
        let saida = d.slice(0, 2);
        if (d.length > 2) saida += '/' + d.slice(2, 4);
        if (d.length > 4) saida += '/' + d.slice(4, 8);
        return saida;
    }

    aplicarMascara(document.getElementById('cpf'), mascaraCPF);
    aplicarMascara(document.getElementById('telefone'), mascaraTelefone);
    aplicarMascara(document.getElementById('checkoutCpf'), mascaraCPF);
    aplicarMascara(document.getElementById('checkoutNascimento'), mascaraData);

    // === Validação da Etapa 2 ===
    const step2Inputs = document.querySelectorAll(".step2-form .input-field");
    const btnProximaEtapa = document.getElementById("btnProximaEtapa");

    function checkStep2Form() {
        let allFilled = true;
        step2Inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (allFilled) {
            btnProximaEtapa.classList.remove("btn-disabled");
            // btn-primary já tem a cor vermelha quando não tem btn-disabled
        } else {
            btnProximaEtapa.classList.add("btn-disabled");
        }
    }

    step2Inputs.forEach((input, index) => {
        input.addEventListener("input", checkStep2Form);

        input.addEventListener("keydown", (e) => {
            // No celular, ao apertar 'retorno' / 'Enter'
            if (e.key === "Enter") {
                e.preventDefault(); 
                
                // Se não for o último campo
                if (index < step2Inputs.length - 1) {
                    const nextInput = step2Inputs[index + 1];
                    nextInput.focus();
                    
                    // Um leve timeout para o iOS processar o foco e o scroll
                    setTimeout(() => {
                        nextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                } else {
                    // Último campo apenas tira o foco para fechar o teclado
                    input.blur();
                }
            }
        });
    });



    // Click no Logo para voltar para a tela inicial
    const logoAdemicon = document.getElementById("logoAdemicon");
    if(logoAdemicon) {
        logoAdemicon.addEventListener("click", () => {
            step2.style.display = "none";
            const step3 = document.getElementById("step3");
            if (step3) step3.style.display = "none";
            step1.style.display = "flex"; // usa div normal, entao main é block
            window.scrollTo(0, 0);
        });
    }




    // === Transição Etapa 2 -> Etapa 3 ===
    const step3 = document.getElementById('step3');
    window.appData = { produto: 'imóvel', nome: '', email: '', cpf: '', telefone: '', nascimento: '', genero: '', estadoCivil: '', renda: '', profissao: '', cep: '', endereco: null, numero: '', complemento: '', semComplemento: false, pagamento: 'PIX' };

    function capturarEtapa2() {
        const campos = document.querySelectorAll('.step2-form .input-field');
        window.appData.nome = campos[0].value.trim();
        window.appData.email = campos[1].value.trim();
        window.appData.cpf = campos[2].value.trim();
        window.appData.telefone = campos[3].value.trim();
    }

    if(btnProximaEtapa) {
        btnProximaEtapa.addEventListener('click', () => {
            // Removida a trava para testes (se estiver disabled, avança igual)
            
            capturarEtapa2();

            if (modoEdicao) { voltarParaRevisao(); return; }

            let nomeUsado = window.appData.nome || 'Visitante';
            let firstName = nomeUsado.split(' ')[0];
            firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
            const produto = document.getElementById('produtoText').textContent.trim().toLowerCase();
            window.appData.produto = produto;

            document.getElementById('resultadoTitle').innerHTML = '<b>' + firstName + '</b>, este é o resultado da sua simulação para <b>' + produto + '</b>';

            document.getElementById('step2').style.display = 'none';
            step3.style.display = 'block';
            window.scrollTo(0, 0);
        });
    }

    const planoCards = document.querySelectorAll('.plano-card');
    planoCards.forEach(card => {
        card.addEventListener('click', () => {
            planoCards.forEach(c => c.classList.remove('plano-card-selected'));
            card.classList.add('plano-card-selected');
        });
    });



    // === Modais de Informação ===
    const infoModal = document.getElementById('infoModal');
    const infoModalTitle = document.getElementById('infoModalTitle');
    const infoModalText = document.getElementById('infoModalText');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const btnEntendi = document.getElementById('btnEntendi');

    const modalData = {
        taxaAdm: {
            title: 'Taxa ADM',
            text: 'A Taxa Administrativa é um valor diluído nas prestações mensais que serve para a gestão dos grupos de consorciados, ela já vem calculada nas parcelas e não é cumulativa. Possui valor fixo pré-estipulado em contrato.\n\nComo é calculada?\n\nA taxa é de 0,12% ao mês, o que equivale a aproximadamente 1,45% ao ano. Este valor é descontado de sua parcela mensal, junto com a contribuição ao fundo comum do grupo.'
        },
        parcelaReduzida: {
            title: 'Parcela reduzida',
            text: 'Com a parcela reduzida, você começa pagando um valor menor e só assume a parcela cheia depois da contemplação.\n\nPor exemplo: para um crédito de R$ 380mil, você pode pagar R$ 451 por mês.\n\nSe for contemplado no 15º mês, por exemplo, a partir do 16º mês a sua parcela passa a ser R$ 903. A diferença é diluída nas parcelas restantes.\n\nOs valores e prazos variam conforme o grupo e o momento da contemplação.'
        }
    };

    const helpIcons = document.querySelectorAll('.icon-help-wrapper');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita clicar no card acidentalmente
            const type = icon.getAttribute('data-modal');
            if(modalData[type]) {
                infoModalTitle.textContent = modalData[type].title;
                infoModalText.textContent = modalData[type].text;
                infoModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
            }
        });
    });

    function closeInfoModal() {
        infoModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeInfoModal);
    if(btnEntendi) btnEntendi.addEventListener('click', closeInfoModal);


    // === Etapa 4: Especialista ===
    const btnEspecialista = document.getElementById('btnEspecialista');
    const step4 = document.getElementById('step4');
    const globalHeader = document.getElementById('globalHeader');
    const step4Header = document.getElementById('step4Header');
    const btnBackToStep3 = document.getElementById('btnBackToStep3');
    // enderecosList redeclared
    // searchInput redeclared

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

    if (btnEspecialista) {
        const newBtn = btnEspecialista.cloneNode(true);
        btnEspecialista.parentNode.replaceChild(newBtn, btnEspecialista);
        newBtn.addEventListener('click', () => {
            document.getElementById('step3').style.display = 'none';
            globalHeader.style.display = 'none';
            step4Header.style.display = 'flex';
            step4.style.display = 'flex';
            window.scrollTo(0, 0);
            step4State = 'estados';
            if (searchInput) searchInput.value = '';
            renderList();
        });
    }

    if (btnBackToStep3) {
        btnBackToStep3.addEventListener('click', () => {
            step4.style.display = 'none';
            step4Header.style.display = 'none';
            globalHeader.style.display = 'flex';
            document.getElementById('step3').style.display = 'flex';
        });
    }

    if (searchInput) {
        const newSearch = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearch, searchInput);
        newSearch.addEventListener('input', (e) => {
            renderList(e.target.value);
        });
    }
// === Etapa 5: Checkout 100% Digital ===
    const btnContratar = document.getElementById('btnContratar');
    const checkoutHeader = document.getElementById('checkoutHeader');
    const checkoutStep1 = document.getElementById('checkoutStep1');
    const btnBackToStep3FromCheckout = document.getElementById('btnBackToStep3FromCheckout');
    
    const checkoutAccordion = document.getElementById('checkoutAccordion');
    const checkoutAccordionIcon = document.getElementById('checkoutAccordionIcon');
    const checkoutCpf = document.getElementById('checkoutCpf');
    const cpfInput = document.getElementById('cpf');

    if (btnContratar) {
        btnContratar.addEventListener('click', () => {
            document.getElementById('step3').style.display = 'none';
            globalHeader.style.display = 'none';
            
            checkoutHeader.style.display = 'flex';
            checkoutStep1.style.display = 'flex';
            window.scrollTo(0, 0);
            
            // Traz o CPF ja informado na Etapa 2 (vazio mostra o placeholder)
            if (checkoutCpf && cpfInput) {
                checkoutCpf.value = cpfInput.value;
            }

            entrarNoCheckout();

            // Entra sempre pela primeira etapa (sem forcar o teclado)
            mostrarEtapa(0, false);

            // Sempre entra com o card recolhido
            if (checkoutAccordion) {
                checkoutAccordion.classList.remove('is-open');
                const t = document.getElementById('checkoutAccordionTitle');
                if (t) t.innerHTML = 'Opção 1: Crédito <strong>R$&nbsp;500.000</strong>';
            }

        });
    }

    // === Etapas de "Dados Pessoais" dentro do checkout ===
    // A fase 1 tera 8 telas no total. As 3 que faltam (profissao, CEP e
    // numero/complemento) entram depois; e so acrescentar aqui e no HTML.
    // Derivado do DOM: acrescentar uma <section class="checkout-etapa"> no HTML
    // ja ajusta a barra sozinho, sem mexer aqui.

    // --- Altura visivel real ---
    // No iOS o teclado NAO encolhe a viewport de layout (nem 100dvh reage a ele),
    // ele so cobre a tela. O visualViewport e o unico que reporta a area que
    // sobrou, entao e dele que sai a altura do app.
    function ajustarAlturaVisivel() {
        const raiz = document.documentElement;
        const vv = window.visualViewport;
        if (!vv) {
            raiz.style.setProperty('--altura-visivel', window.innerHeight + 'px');
            return;
        }
        raiz.style.setProperty('--altura-visivel', vv.height + 'px');
        // Ao abrir o teclado o Safari desloca a viewport de layout para cima.
        // offsetTop e o tanto que ela subiu; devolvemos isso no topo do app,
        // senao o rodape sobe junto e descola do teclado.
        raiz.style.setProperty('--desloc-topo', vv.offsetTop + 'px');
    }

    ajustarAlturaVisivel();
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', ajustarAlturaVisivel);
        window.visualViewport.addEventListener('scroll', ajustarAlturaVisivel);
    } else {
        window.addEventListener('resize', ajustarAlturaVisivel);
    }

    function entrarNoCheckout() {
        document.documentElement.classList.add('checkout-ativo');
        ajustarAlturaVisivel();
        window.scrollTo(0, 0);
    }

    function sairDoCheckout() {
        document.documentElement.classList.remove('checkout-ativo');
    }

    const etapas = Array.from(document.querySelectorAll('#checkoutStep1 .checkout-etapa'));
    const progressoBarra = document.getElementById('progressoBarra');
    const areaRolagem = document.querySelector('#checkoutStep1 .checkout-rolagem');
    let etapaAtual = 0;

    function mostrarEtapa(indice, focar) {
        etapaAtual = indice;
        etapas.forEach((secao, i) => secao.classList.toggle('etapa-ativa', i === indice));

        if (progressoBarra) {
            progressoBarra.style.width = ((indice + 1) / TOTAL_TELAS_CHECKOUT * 100) + '%';
        }
        if (areaRolagem) areaRolagem.scrollTop = 0;

        limparEstadoPix();
        atualizarResumos();

        const secaoAtual = etapas[indice];

        const rodape = document.querySelector('#checkoutStep1 .checkout-rodape');
        if (rodape) rodape.hidden = secaoAtual.hasAttribute('data-sem-rodape');

        // A conclusao nao mostra o card da proposta nem a seta de voltar
        if (checkoutAccordion) {
            checkoutAccordion.hidden = secaoAtual.hasAttribute('data-sem-accordion');
        }
        const tituloHeader = document.querySelector('#checkoutHeader span');
        if (tituloHeader) {
            tituloHeader.textContent = secaoAtual.dataset.tituloHeader || 'Checkout';
        }

        if (etapas[indice].dataset.etapa === 'pix') restaurarPix();
        else pararRelogioPix();

        const naRevisao = etapas[indice].dataset.etapa === 'revisao';
        if (naRevisao) montarRevisao();
        if (rodapeChecks) rodapeChecks.hidden = !naRevisao;

        const rotulo = document.getElementById('progressoTexto');
        if (rotulo) {
            rotulo.textContent = etapas[indice].dataset.rotulo || 'Passo 1 de 3: Dados Pessoais';
        }

        atualizarBotaoEtapa();

        // O foco precisa acontecer no mesmo passo sincrono do clique,
        // senao o iOS ignora e o teclado nao abre.
        if (focar) {
            const campo = etapas[indice].querySelector('[data-autofoco]');
            if (campo) campo.focus();
        }
    }

    // Algumas etapas exigem escolha antes de seguir (data-requer-selecao no HTML)
    function atualizarBotaoEtapa() {
        const botao = document.getElementById('btnNextCheckout');
        if (!botao) return;
        const secao = etapas[etapaAtual];
        if (!secao) return;

        // A opcao marcada pode ditar o texto do botao (ex.: "Gerar código PIX")
        const escolhida = secao.querySelector('input[type="radio"]:checked');
        const textoPadrao = (escolhida && escolhida.dataset.botao) ||
                            secao.dataset.botao || 'Próxima etapa';
        botao.textContent = modoEdicao ? 'Salvar alteração' : textoPadrao;

        let liberado = true;
        if (secao.hasAttribute('data-requer-selecao')) {
            liberado = !!secao.querySelector('input:checked');
        }
        // A revisao so libera o pagamento com os termos aceitos
        if (secao.dataset.etapa === 'revisao' && aceitaTermos) {
            liberado = aceitaTermos.checked;
        }

        botao.classList.toggle('btn-disabled', !liberado);
        botao.disabled = !liberado;
    }

    function irParaEtapa(indice) {
        if (indice < 0) {
            irParaPropostas(); // antes da primeira etapa, volta para as propostas
            return;
        }
        if (indice > etapas.length - 1) return; // ultima etapa por enquanto
        mostrarEtapa(indice, true);
    }

    // === Etapa: profissao ===
    // Lista alfabetica. As 16 primeiras vieram do Figma; o resto foi
    // acrescentado para o filtro ter o que filtrar no prototipo.
    const PROFISSOES = [
        'Açougueiro(a)', 'Administrador', 'Advogado(a)',
        'Aeromoça', 'Aeronauta', 'Agente de Estágio',
        'Agente de Habitação', 'Agente de Segurança', 'Agente de Trânsito',
        'Agente Educacional', 'Agente Fiscal', 'Agente Monitorador',
        'Agente Penitenciário', 'Agente Sanitário', 'Agente Turismo',
        'Agricultor', 'Analista de Sistemas', 'Aposentado(a)',
        'Arquiteto(a)', 'Artesão(ã)', 'Assistente Administrativo',
        'Assistente Social', 'Atendente', 'Auditor(a)',
        'Autônomo(a)', 'Auxiliar de Enfermagem', 'Auxiliar de Limpeza',
        'Babá', 'Balconista', 'Bancário(a)',
        'Barbeiro(a)', 'Bibliotecário(a)', 'Biólogo(a)',
        'Biomédico(a)', 'Bombeiro(a)', 'Borracheiro(a)',
        'Cabeleireiro(a)', 'Caixa', 'Carpinteiro(a)',
        'Cerimonialista', 'Chaveiro(a)', 'Chefe de Cozinha',
        'Confeiteiro(a)', 'Consultor(a)', 'Contador(a)',
        'Corretor(a) de Imóveis', 'Costureiro(a)', 'Cozinheiro(a)',
        'Dentista', 'Desempregado(a)', 'Designer',
        'Despachante', 'Digitador(a)', 'Diretor(a)',
        'Do lar', 'Economista', 'Educador(a) Físico(a)',
        'Eletricista', 'Empresário(a)', 'Enfermeiro(a)',
        'Engenheiro(a)', 'Estagiário(a)', 'Esteticista',
        'Estudante', 'Farmacêutico(a)', 'Fisioterapeuta',
        'Fonoaudiólogo(a)', 'Fotógrafo(a)', 'Funileiro(a)',
        'Garçom / Garçonete', 'Gerente', 'Gesseiro(a)',
        'Historiador(a)', 'Jardineiro(a)', 'Jornalista',
        'Juiz(a)', 'Lavador(a)', 'Leiloeiro(a)',
        'Manicure', 'Maquiador(a)', 'Marceneiro(a)',
        'Mecânico(a)', 'Médico(a)', 'Metalúrgico(a)',
        'Militar', 'Motoboy', 'Motorista',
        'Músico(a)', 'Nutricionista', 'Odontólogo(a)',
        'Operador(a) de Máquinas', 'Padeiro(a)', 'Pedagogo(a)',
        'Pedreiro(a)', 'Personal Trainer', 'Pescador(a)',
        'Piloto(a)', 'Pintor(a)', 'Policial',
        'Porteiro(a)', 'Produtor(a) Rural', 'Professor(a)',
        'Programador(a)', 'Promotor(a) de Vendas', 'Psicólogo(a)',
        'Publicitário(a)', 'Químico(a)', 'Radialista',
        'Recepcionista', 'Repositor(a)', 'Representante Comercial',
        'Secretário(a)', 'Segurança', 'Serralheiro(a)',
        'Servidor(a) Público(a)', 'Soldador(a)', 'Sommelier',
        'Supervisor(a)', 'Tatuador(a)', 'Taxista',
        'Técnico(a) de Enfermagem', 'Técnico(a) em Informática', 'Tecnólogo(a)',
        'Telefonista', 'Terapeuta', 'Tradutor(a)',
        'Vendedor(a)', 'Veterinário(a)', 'Vigilante',
        'Zelador(a)', 'Outra profissão'
    ];

    const listaProfissoes = document.getElementById('listaProfissoes');
    const filtroProfissao = document.getElementById('filtroProfissao');
    const profissaoVazia = document.getElementById('profissaoVazia');

    // Sem acento e sem maiuscula: quem digita "medico" acha "Medico(a)"
    function semAcento(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function montarProfissoes(termo) {
        if (!listaProfissoes) return;
        const busca = semAcento((termo || '').trim());
        const escolhida = window.appData ? window.appData.profissao : '';

        listaProfissoes.textContent = '';
        let visiveis = 0;

        PROFISSOES.forEach(nome => {
            if (busca && !semAcento(nome).includes(busca)) return;
            visiveis++;

            // Montado por DOM, nao por innerHTML: nada de template gigante
            const opcao = document.createElement('label');
            opcao.className = 'radio-opcao';
            if (nome === escolhida) opcao.classList.add('selecionado');

            const entrada = document.createElement('input');
            entrada.type = 'radio';
            entrada.name = 'profissao';
            entrada.value = nome;
            entrada.checked = (nome === escolhida);

            const marca = document.createElement('span');
            marca.className = 'radio-marca';

            const texto = document.createElement('span');
            texto.className = 'radio-texto';
            texto.textContent = nome;

            opcao.append(entrada, marca, texto);
            listaProfissoes.appendChild(opcao);
        });

        if (profissaoVazia) profissaoVazia.hidden = visiveis > 0;
    }

    if (filtroProfissao) {
        filtroProfissao.addEventListener('input', () => montarProfissoes(filtroProfissao.value));
    }
    montarProfissoes('');

    // === Etapas de endereco ===
    const checkoutCep = document.getElementById('checkoutCep');
    const cepErro = document.getElementById('cepErro');
    const checkoutNumero = document.getElementById('checkoutNumero');
    const checkoutComplemento = document.getElementById('checkoutComplemento');
    const semComplemento = document.getElementById('semComplemento');

    // Usado quando o ViaCEP nao responde ou o CEP nao existe. E o endereco do Figma.
    const ENDERECO_EXEMPLO = {
        logradouro: 'Rua Manoel Cetano da Silva',
        bairro: 'Três Vendas',
        localidade: 'Rio de Janeiro',
        uf: 'RJ',
        cep: '2220-001'
    };

    function mascaraCEP(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 8);
        if (d.length <= 5) return d;
        return d.slice(0, 5) + '-' + d.slice(5);
    }

    aplicarMascara(checkoutCep, mascaraCEP);

    // Monta o texto que aparece no topo das telas de numero e complemento
    function textoEndereco(comNumero) {
        const e = window.appData.endereco || ENDERECO_EXEMPLO;
        const numero = window.appData.numero;
        // Figma: "Rua X, Bairro" sem numero; "Rua X, 123 Bairro" com numero
        let primeira = e.logradouro;
        if (comNumero && numero) primeira += ', ' + numero;
        if (e.bairro) primeira += (comNumero && numero ? ' ' : ', ') + e.bairro;
        const linhas = [primeira, e.localidade + ' / ' + e.uf + ' - ' + e.cep];
        if (comNumero && numero) linhas.push('Número ' + numero);
        return linhas.join('\n');
    }

    function atualizarResumos() {
        const r1 = document.getElementById('resumoNumero');
        const r2 = document.getElementById('resumoComplemento');
        if (r1) r1.textContent = textoEndereco(false);
        if (r2) r2.textContent = textoEndereco(true);
    }

    // Busca no ViaCEP. Se der qualquer problema, usa o endereco de exemplo:
    // o prototipo nunca trava por causa de rede.
    async function buscarCep(cep) {
        const digitos = cep.replace(/\D/g, '');
        if (digitos.length !== 8) return;

        if (cepErro) { cepErro.hidden = true; cepErro.textContent = ''; }

        let dados = null;
        try {
            const resposta = await fetch('https://viacep.com.br/ws/' + digitos + '/json/');
            const json = await resposta.json();
            if (!json.erro && json.logradouro) dados = json;
        } catch (e) {
            // offline ou API fora do ar: segue para o exemplo
        }

        if (!dados) {
            dados = Object.assign({}, ENDERECO_EXEMPLO);
            if (cepErro) {
                cepErro.hidden = false;
                cepErro.textContent = 'Não localizamos esse CEP. Seguindo com um endereço de exemplo.';
            }
        }

        window.appData.endereco = {
            logradouro: dados.logradouro,
            bairro: dados.bairro,
            localidade: dados.localidade,
            uf: dados.uf,
            cep: mascaraCEP(digitos)
        };
        window.appData.cep = mascaraCEP(digitos);
        atualizarResumos();
    }

    if (checkoutCep) {
        checkoutCep.addEventListener('input', () => {
            if (checkoutCep.value.replace(/\D/g, '').length === 8) buscarCep(checkoutCep.value);
        });
    }

    if (checkoutNumero) {
        checkoutNumero.addEventListener('input', () => {
            window.appData.numero = checkoutNumero.value.trim();
            atualizarResumos();
        });
    }

    if (checkoutComplemento) {
        checkoutComplemento.addEventListener('input', () => {
            window.appData.complemento = checkoutComplemento.value.trim();
            if (semComplemento && checkoutComplemento.value) semComplemento.checked = false;
        });
    }

    if (semComplemento) {
        semComplemento.addEventListener('change', () => {
            if (semComplemento.checked && checkoutComplemento) {
                checkoutComplemento.value = '';
                window.appData.complemento = '';
            }
            window.appData.semComplemento = semComplemento.checked;
        });
    }

    // === Tela de revisao ===
    // Total de telas do checkout inteiro: 9 da fase 1 + revisao + meio de
    // pagamento + pagar + confirmacao. A barra e continua e nunca reseta.
    const TOTAL_TELAS_CHECKOUT = 13;

    // 'etapa' aponta para onde o toque leva. 'step2' e a tela de dados iniciais.
    const CAMPOS_REVISAO = [
        { rotulo: 'Nome',        etapa: 'step2',       valor: () => window.appData.nome },
        { rotulo: 'E-mail',      etapa: 'step2',       valor: () => window.appData.email },
        { rotulo: 'CPF',         etapa: 'cpf',         valor: () => window.appData.cpf },
        { rotulo: 'Telefone',    etapa: 'step2',       valor: () => window.appData.telefone },
        { rotulo: 'Nascimento',  etapa: 'nascimento',  valor: () => window.appData.nascimento },
        { rotulo: 'Gênero',      etapa: 'genero',      valor: () => window.appData.genero },
        { rotulo: 'Estado civil',etapa: 'estadoCivil', valor: () => window.appData.estadoCivil },
        { rotulo: 'Renda',       etapa: 'renda',       valor: () => window.appData.renda },
        { rotulo: 'Profissão',   etapa: 'profissao',   valor: () => window.appData.profissao },
        { rotulo: 'CEP',         etapa: 'cep',         valor: () => window.appData.cep },
        { rotulo: 'Endereço',    etapa: 'numero',      valor: enderecoResumido },
        { rotulo: 'Complemento', etapa: 'complemento', valor: () => window.appData.semComplemento ? 'Não possui' : window.appData.complemento }
    ];

    function enderecoResumido() {
        const e = window.appData.endereco;
        if (!e) return '';
        const numero = window.appData.numero;
        return e.logradouro + (numero ? ', ' + numero : '') +
               (e.bairro ? ' - ' + e.bairro : '') +
               ' - ' + e.localidade + '/' + e.uf;
    }

    const revisaoLista = document.getElementById('revisaoLista');
    const rodapeChecks = document.getElementById('rodapeChecks');
    const aceitaTermos = document.getElementById('aceitaTermos');

    function indiceDaEtapa(nome) {
        return etapas.findIndex(secao => secao.dataset.etapa === nome);
    }

    function montarRevisao() {
        if (!revisaoLista) return;
        revisaoLista.textContent = '';

        CAMPOS_REVISAO.forEach(campo => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'revisao-item';

            const rotulo = document.createElement('span');
            rotulo.className = 'revisao-rotulo';
            rotulo.textContent = campo.rotulo;

            const valor = document.createElement('span');
            valor.className = 'revisao-valor';
            valor.textContent = campo.valor() || '';

            item.append(rotulo, valor);
            item.addEventListener('click', () => editarCampo(campo.etapa));
            revisaoLista.appendChild(item);
        });
    }

    function editarCampo(destino) {
        modoEdicao = true;

        if (destino === 'step2') {
            // Tela de dados iniciais: fica fora do container do checkout
            sairDoCheckout();
            checkoutStep1.style.display = 'none';
            checkoutHeader.style.display = 'none';
            globalHeader.style.display = 'flex';
            document.getElementById('step2').style.display = 'flex';
            if (btnProximaEtapa) {
                btnProximaEtapa.textContent = 'Salvar alteração';
                btnProximaEtapa.classList.remove('btn-disabled');
            }
            window.scrollTo(0, 0);
            return;
        }

        const indice = indiceDaEtapa(destino);
        if (indice >= 0) mostrarEtapa(indice, true);
    }

    function voltarParaRevisao() {
        modoEdicao = false;
        if (btnProximaEtapa) btnProximaEtapa.textContent = 'Próxima Etapa';

        document.getElementById('step2').style.display = 'none';
        globalHeader.style.display = 'none';
        checkoutHeader.style.display = 'flex';
        checkoutStep1.style.display = 'flex';
        entrarNoCheckout();

        const indice = indiceDaEtapa('revisao');
        if (indice >= 0) mostrarEtapa(indice, false);
    }

    if (aceitaTermos) {
        aceitaTermos.addEventListener('change', atualizarBotaoEtapa);
    }

    // === Geracao do codigo PIX ===
    // O botao vira a propria barra de progresso: a base fica #9E2436 e o
    // preenchimento #EE3124 cresce ate 100%. Depois ele encolhe para um
    // circulo com o check e aparece a dica "Voce sera redirecionado".
    const DURACAO_PIX = 2000;
    const rodapeDica = document.getElementById('rodapeDica');
    let gerandoPix = false;

    // Anima um botao como barra de progresso. Reaproveitado no "Gerar codigo
    // PIX" do rodape e no "Gerar um novo codigo" da tela do QR.
    function animarBotaoProgresso(botao, opcoes) {
        if (gerandoPix) return;
        gerandoPix = true;

        const cfg = opcoes || {};
        const rolagem = document.querySelector('#checkoutStep1 .checkout-rolagem');
        const textoOriginal = botao.innerHTML;

        // O botao do rodape fica fora da area rolavel; o do card do PIX esta
        // dentro dela, entao nao pode esmaecer junto com o resto.
        const classeEsmaecer = cfg.viraCirculo ? 'esmaecido' : 'esmaecido-parcial';
        if (rolagem) rolagem.classList.add(classeEsmaecer);
        botao.disabled = true;
        botao.classList.add('carregando');
        botao.textContent = cfg.texto || 'Seu código está sendo gerado';
        botao.style.setProperty('--preenchimento', '0%');

        const inicio = performance.now();

        function passo(agora) {
            const parte = Math.min((agora - inicio) / DURACAO_PIX, 1);
            botao.style.setProperty('--preenchimento', (parte * 100) + '%');
            if (parte < 1) {
                requestAnimationFrame(passo);
                return;
            }
            if (cfg.viraCirculo) {
                botao.textContent = '';
                botao.classList.add('concluido');
                if (rodapeDica) rodapeDica.hidden = false;
            }
            setTimeout(() => {
                gerandoPix = false;
                botao.disabled = false;
                botao.classList.remove('carregando', 'concluido');
                botao.style.removeProperty('--preenchimento');
                botao.innerHTML = textoOriginal;
                if (rolagem) rolagem.classList.remove(classeEsmaecer);
                if (rodapeDica) rodapeDica.hidden = true;
                if (cfg.aoTerminar) cfg.aoTerminar();
            }, cfg.pausa || 900);
        }

        requestAnimationFrame(passo);
    }

    function gerarCodigoPix() {
        const botao = document.getElementById('btnNextCheckout');
        animarBotaoProgresso(botao, {
            viraCirculo: true,
            aoTerminar: () => irParaEtapa(etapaAtual + 1)
        });
    }

    // Desfaz o estado de geracao ao sair da tela de pagamento
    function limparEstadoPix() {
        const botao = document.getElementById('btnNextCheckout');
        const rolagem = document.querySelector('#checkoutStep1 .checkout-rolagem');
        gerandoPix = false;
        if (rolagem) rolagem.classList.remove('esmaecido', 'esmaecido-parcial');
        if (rodapeDica) rodapeDica.hidden = true;
        if (botao) {
            botao.classList.remove('carregando', 'concluido');
            botao.style.removeProperty('--preenchimento');
        }
    }

    // === Tela do QR Code PIX ===
    const CODIGO_PIX = '00020126580014BR.GOV.BCB.PIX0136ademicon-simulador-codigo-exemplo5204000053039865802BR5913ADEMICON6009CURITIBA62070503***6304A1B2';
    const SEGUNDOS_VALIDADE = 2 * 60 * 60 - 1; // 01:59:59

    const btnCopiarPix = document.getElementById('btnCopiarPix');
    const btnExpiraEm = document.getElementById('btnExpiraEm');
    const btnJaPaguei = document.getElementById('btnJaPaguei');
    const pixRelogio = document.getElementById('pixRelogio');
    const pixQr = document.getElementById('pixQr');
    const pixQrExpirado = document.getElementById('pixQrExpirado');

    let relogioPix = null;
    let restamPix = SEGUNDOS_VALIDADE;

    function formatarRelogio(total) {
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
    }

    function pararRelogioPix() {
        if (relogioPix) { clearInterval(relogioPix); relogioPix = null; }
    }

    function iniciarRelogioPix() {
        pararRelogioPix();
        restamPix = SEGUNDOS_VALIDADE;
        if (pixRelogio) pixRelogio.textContent = formatarRelogio(restamPix);
        relogioPix = setInterval(() => {
            restamPix--;
            if (pixRelogio) pixRelogio.textContent = formatarRelogio(Math.max(restamPix, 0));
            if (restamPix <= 0) expirarPix();
        }, 1000);
    }

    // Estado expirado: QR some, o botao vira "Gerar um novo codigo"
    function expirarPix() {
        pararRelogioPix();
        if (pixQr) pixQr.hidden = true;
        if (pixQrExpirado) pixQrExpirado.hidden = false;
        if (btnExpiraEm) btnExpiraEm.hidden = true;
        if (btnCopiarPix) {
            btnCopiarPix.classList.remove('copiado');
            btnCopiarPix.innerHTML = '<span class="pix-acao-texto">Gerar um novo código</span>';
            btnCopiarPix.dataset.modo = 'gerar';
        }
    }

    function restaurarPix() {
        pararRelogioPix();
        if (pixQr) pixQr.hidden = false;
        if (pixQrExpirado) pixQrExpirado.hidden = true;
        if (btnExpiraEm) btnExpiraEm.hidden = false;
        if (btnCopiarPix) {
            btnCopiarPix.classList.remove('copiado');
            btnCopiarPix.innerHTML = '<img src="assets/icon-copy.svg" alt="" class="pix-icone">' +
                                     '<span class="pix-acao-texto">Copiar código</span>';
            btnCopiarPix.dataset.modo = 'copiar';
        }
        iniciarRelogioPix();
    }

    async function copiarCodigoPix() {
        try {
            await navigator.clipboard.writeText(CODIGO_PIX);
        } catch (e) {
            // Sem permissao de clipboard (http em alguns navegadores): usa o
            // caminho antigo, que ainda funciona fora de contexto seguro.
            const campo = document.createElement('textarea');
            campo.value = CODIGO_PIX;
            campo.setAttribute('readonly', '');
            campo.style.position = 'fixed';
            campo.style.opacity = '0';
            document.body.appendChild(campo);
            campo.select();
            try { document.execCommand('copy'); } catch (e2) { /* segue mesmo assim */ }
            document.body.removeChild(campo);
        }

        btnCopiarPix.classList.add('copiado');
        btnCopiarPix.innerHTML = '<span class="pix-acao-texto">Código copiado!</span>';
        setTimeout(() => {
            if (btnCopiarPix.dataset.modo !== 'copiar') return;
            btnCopiarPix.classList.remove('copiado');
            btnCopiarPix.innerHTML = '<img src="assets/icon-copy.svg" alt="" class="pix-icone">' +
                                     '<span class="pix-acao-texto">Copiar código</span>';
        }, 2500);
    }

    if (btnCopiarPix) {
        btnCopiarPix.dataset.modo = 'copiar';
        btnCopiarPix.addEventListener('click', () => {
            if (btnCopiarPix.dataset.modo === 'gerar') {
                // Mesma animacao do botao anterior, agora dentro do card
                animarBotaoProgresso(btnCopiarPix, {
                    texto: 'Seu código está sendo gerado',
                    pausa: 400,
                    aoTerminar: restaurarPix
                });
                return;
            }
            copiarCodigoPix();
        });
    }

    // Atalho para o cliente validar a tela de codigo expirado
    if (btnExpiraEm) btnExpiraEm.addEventListener('click', expirarPix);

    if (btnJaPaguei) {
        btnJaPaguei.addEventListener('click', () => {
            const destino = etapas.findIndex(s => s.dataset.etapa === 'conclusao');
            if (destino >= 0) mostrarEtapa(destino, false);
        });
    }

    const btnNextCheckout = document.getElementById('btnNextCheckout');
    if (btnNextCheckout) {
        btnNextCheckout.addEventListener('click', () => {
            if (btnNextCheckout.disabled) return;
            if (modoEdicao) { voltarParaRevisao(); return; }

            const secao = etapas[etapaAtual];
            if (secao.dataset.etapa === 'pagamento' && window.appData.pagamento === 'PIX') {
                gerarCodigoPix();
                return;
            }

            irParaEtapa(etapaAtual + 1);
        });
    }

    if (btnBackToStep3FromCheckout) {
        btnBackToStep3FromCheckout.addEventListener('click', () => {
            if (modoEdicao) { voltarParaRevisao(); return; }
            irParaEtapa(etapaAtual - 1);
        });
    }

    // Radios: o visual e do label, entao o estado selecionado vira classe
    function sincronizarLista(lista) {
        lista.querySelectorAll('.radio-opcao').forEach(opcao => {
            const entrada = opcao.querySelector('input[type="radio"]');
            opcao.classList.toggle('selecionado', entrada.checked);
            if (entrada.checked && window.appData) {
                window.appData[entrada.name] = entrada.value;
            }
        });
    }

    document.querySelectorAll('#checkoutStep1 .radio-lista').forEach(lista => {
        sincronizarLista(lista); // aplica o que ja vem marcado no HTML
        lista.addEventListener('change', () => {
            sincronizarLista(lista);
            atualizarBotaoEtapa();
        });
    });

    const checkoutNascimento = document.getElementById('checkoutNascimento');
    if (checkoutNascimento) {
        checkoutNascimento.addEventListener('input', () => {
            if (window.appData) window.appData.nascimento = checkoutNascimento.value;
        });
    }

    // Editar o CPF no checkout reflete de volta na Etapa 2 e no appData
    if (checkoutCpf) {
        checkoutCpf.addEventListener('input', () => {
            if (cpfInput) cpfInput.value = checkoutCpf.value;
            if (window.appData) window.appData.cpf = checkoutCpf.value;
        });
    }

    const checkoutAccordionTitle = document.getElementById('checkoutAccordionTitle');
    const TITULO_FECHADO = 'Opção 1: Crédito <strong>R$&nbsp;500.000</strong>';
    const TITULO_ABERTO = 'Detalhes';

    if (checkoutAccordion) {
        checkoutAccordion.addEventListener('click', (e) => {
            // Não alterna ao clicar em botões ou nos ícones de ajuda
            if (e.target.closest('button') || e.target.closest('.icon-help-wrapper')) return;

            const aberto = checkoutAccordion.classList.toggle('is-open');
            checkoutAccordionIcon.alt = aberto ? 'Recolher' : 'Expandir';
            if (checkoutAccordionTitle) {
                checkoutAccordionTitle.innerHTML = aberto ? TITULO_ABERTO : TITULO_FECHADO;
            }
        });
    }

    // Ações do card expandido — reaproveitam os fluxos já existentes
    const btnAccordionUnidade = document.getElementById('btnAccordionUnidade');
    const btnAccordionPropostas = document.getElementById('btnAccordionPropostas');

    // Saidas do checkout usadas por varios botoes
    function irParaUnidades() {
        sairDoCheckout();
        checkoutStep1.style.display = 'none';
        checkoutHeader.style.display = 'none';
        document.getElementById('step4Header').style.display = 'flex';
        document.getElementById('step4').style.display = 'flex';
        window.scrollTo(0, 0);
        const btnEspecialista = document.getElementById('btnEspecialista');
        if (btnEspecialista) btnEspecialista.click(); // Reaproveita a lógica existente
    }

    function irParaPropostas() {
        sairDoCheckout();
        checkoutStep1.style.display = 'none';
        checkoutHeader.style.display = 'none';
        globalHeader.style.display = 'flex';
        document.getElementById('step3').style.display = 'flex';
        window.scrollTo(0, 0);
    }

    if (btnAccordionUnidade) {
        btnAccordionUnidade.addEventListener('click', irParaUnidades);
    }

    // Mesmos destinos nas telas do PIX e da conclusao
    [
        ['btnPixEspecialista', irParaUnidades],
        ['btnConclusaoEspecialista', irParaUnidades],
        ['btnPixPropostas', irParaPropostas],
        ['btnConclusaoPropostas', irParaPropostas]
    ].forEach(([id, acao]) => {
        const botao = document.getElementById(id);
        if (botao) botao.addEventListener('click', acao);
    });

    if (btnAccordionPropostas) {
        btnAccordionPropostas.addEventListener('click', () => {
            if (btnBackToStep3FromCheckout) btnBackToStep3FromCheckout.click();
        });
    }

} catch (e) { console.error('Erro na inicializacao do simulador:', e); }
});