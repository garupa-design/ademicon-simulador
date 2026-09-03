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

    // === Slider do valor + campo, sempre em sincronia ===
    // O usuario pode arrastar o slider ou digitar no campo: os dois escrevem
    // no mesmo valor. Limites e valores iniciais definidos pelo cliente.
    const sliderValor = document.getElementById('sliderValor');
    const sliderMin = document.getElementById('sliderMin');
    const sliderMax = document.getElementById('sliderMax');

    const LIMITES_VALOR = {
        credito: { min: 80000, max: 1273442.29, padrao: 676721.15 },
        parcela: { min: 269.84, max: 8534.62, padrao: 4402.23 }
    };

    let modoValor = 'credito';

    // Agrupamento de milhar por fatiamento, sem grupos de captura ($1),
    // pelo mesmo motivo das outras mascaras do projeto.
    function agruparMilhar(inteiro) {
        let saida = '';
        let conta = 0;
        for (let i = inteiro.length - 1; i >= 0; i--) {
            saida = inteiro.charAt(i) + saida;
            conta++;
            if (conta === 3 && i > 0) {
                saida = '.' + saida;
                conta = 0;
            }
        }
        return saida;
    }

    function formatarMoeda(numero) {
        const centavos = Math.round(Math.abs(numero) * 100);
        const texto = String(centavos).padStart(3, '0');
        const inteiro = texto.slice(0, texto.length - 2);
        const fracao = texto.slice(texto.length - 2);
        return 'R$ ' + agruparMilhar(inteiro) + ',' + fracao;
    }

    function numeroDoTexto(texto) {
        const digitos = String(texto).replace(/\D/g, '');
        if (!digitos.length) return null;
        return parseInt(digitos, 10) / 100;
    }

    // O arraste e continuo (step="any"). Aqui ele vira um numero apresentavel:
    // as duas pontas mantem o limite exato e o meio anda de real em real na
    // faixa do credito, de centavo em centavo na faixa da parcela (bem menor).
    function arredondarValor(numero, limites) {
        const folga = (limites.max - limites.min) / 1000;
        if (numero <= limites.min + folga) return limites.min;
        if (numero >= limites.max - folga) return limites.max;
        if (limites.max - limites.min < 20000) return Math.round(numero * 100) / 100;
        return Math.round(numero);
    }

    // O preenchimento vermelho precisa terminar no centro do polegar, que anda
    // de 8px ate (largura - 8px). Por isso a conta e em pixels, nao em %.
    function pintarSlider() {
        const limites = LIMITES_VALOR[modoValor];
        const largura = sliderValor.getBoundingClientRect().width;
        if (!largura) return;
        const fracao = (Number(sliderValor.value) - limites.min) / (limites.max - limites.min);
        const posicao = 8 + Math.min(Math.max(fracao, 0), 1) * (largura - 16);
        sliderValor.style.setProperty('--slider-preenchido', posicao + 'px');
    }

    function moverSliderPara(numero) {
        const limites = LIMITES_VALOR[modoValor];
        const preso = Math.min(Math.max(numero, limites.min), limites.max);
        sliderValor.value = String(preso);
        pintarSlider();
    }

    function aplicarModoValor(modo) {
        modoValor = modo;
        const limites = LIMITES_VALOR[modo];
        labelValor.textContent = modo === 'credito' ? 'Valor do crédito' : 'Valor da parcela';
        inputValor.placeholder = formatarMoeda(limites.padrao);
        sliderValor.min = String(limites.min);
        sliderValor.max = String(limites.max);
        sliderValor.setAttribute('aria-label', labelValor.textContent);
        sliderMin.textContent = formatarMoeda(limites.min);
        sliderMax.textContent = formatarMoeda(limites.max);
        inputValor.value = formatarMoeda(limites.padrao);
        moverSliderPara(limites.padrao);
    }

    btnCredito.addEventListener('click', () => {
        setActiveToggle(btnCredito, btnParcela);
        aplicarModoValor('credito');
    });

    btnParcela.addEventListener('click', () => {
        setActiveToggle(btnParcela, btnCredito);
        aplicarModoValor('parcela');
    });

    // Arrastar o slider escreve direto no campo.
    sliderValor.addEventListener('input', () => {
        const limites = LIMITES_VALOR[modoValor];
        const numero = Number(sliderValor.value);
        inputValor.value = formatarMoeda(arredondarValor(numero, limites));
        pintarSlider();
    });

    // Digitar no campo move o slider (e aplica a mascara de moeda).
    inputValor.addEventListener('input', () => {
        const numero = numeroDoTexto(inputValor.value);
        if (numero === null) {
            inputValor.value = '';
            return;
        }
        inputValor.value = formatarMoeda(numero);
        moverSliderPara(numero);
    });

    // Ao sair do campo, prende o valor digitado dentro dos limites.
    inputValor.addEventListener('blur', () => {
        const numero = numeroDoTexto(inputValor.value);
        if (numero === null) return;
        const limites = LIMITES_VALOR[modoValor];
        const preso = Math.min(Math.max(numero, limites.min), limites.max);
        if (preso !== numero) inputValor.value = formatarMoeda(preso);
        moverSliderPara(preso);
    });

    // A largura muda com a rotacao do celular: repinta o trilho.
    window.addEventListener('resize', pintarSlider);

    aplicarModoValor('credito');

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

    // Cartao: numero em grupos de 4 e vencimento MM/AA.
    function mascaraCartao(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 16);
        let saida = '';
        for (let i = 0; i < d.length; i++) {
            if (i > 0 && i % 4 === 0) saida += ' ';
            saida += d.charAt(i);
        }
        return saida;
    }

    function mascaraVencimento(valor) {
        const d = valor.replace(/\D/g, '').slice(0, 4);
        let saida = d.slice(0, 2);
        if (d.length > 2) saida += '/' + d.slice(2, 4);
        return saida;
    }

    function mascaraNumeros(limite) {
        return function (valor) {
            return valor.replace(/\D/g, '').slice(0, limite);
        };
    }

    aplicarMascara(document.getElementById('cpf'), mascaraCPF);
    aplicarMascara(document.getElementById('telefone'), mascaraTelefone);
    aplicarMascara(document.getElementById('checkoutCpf'), mascaraCPF);
    aplicarMascara(document.getElementById('checkoutNascimento'), mascaraData);
    aplicarMascara(document.getElementById('cartaoNumero'), mascaraCartao);
    aplicarMascara(document.getElementById('cartaoVencimento'), mascaraVencimento);
    aplicarMascara(document.getElementById('cartaoCvc'), mascaraNumeros(4));
    aplicarMascara(document.getElementById('cartaoCpf'), mascaraCPF);

    // === Validação da Etapa 2 ===
    const step2Inputs = document.querySelectorAll(".step2-form .input-field");
    const btnProximaEtapa = document.getElementById("btnProximaEtapa");

    // === Validacao dos campos ===
    // O erro aparece so quando o usuario sai do campo: quem esta digitando
    // "Joao Carlos" ou "joao@email.com" passa por estados invalidos no
    // caminho e nao merece um alerta. Corrigiu enquanto digita, o erro sai.
    // Nada disso trava o avanco: o cliente precisa percorrer o fluxo inteiro.
    function partesDoNome(texto) {
        return String(texto).trim().split(/\s+/).filter(p => p.length > 0);
    }

    function nomeEstaCompleto(texto) {
        const partes = partesDoNome(texto);
        if (partes.length < 2) return false;
        // Ultima parte com uma letra so e inicial, nao sobrenome.
        return partes[partes.length - 1].length >= 2;
    }

    function emailValido(texto) {
        // Basta ter algo@algo.algo - validacao de e-mail de verdade e o
        // envio de uma confirmacao, nao uma expressao regular.
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(texto).trim());
    }

    // Protótipo: qualquer CPF de 11 digitos passa. Quem esta testando nao
    // quer digitar o proprio CPF nem procurar um valido, entao a unica coisa
    // recusada e a sequencia repetida (00000000000, 11111111111...), que
    // serve de atalho para o cliente ver o estado de erro.
    //
    // Em producao isto volta a ser a checagem dos dois digitos verificadores:
    //   soma dos 9 primeiros x pesos 10..2, resto (soma*10)%11 (10 vira 0)
    //   deve bater com o 10o digito; idem com os 10 primeiros x pesos 11..2
    //   para o 11o.
    function cpfValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        if (d.length !== 11) return false;
        return !/^(\d)\1{10}$/.test(d);
    }

    function telefoneValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        if (d.length !== 10 && d.length !== 11) return false;
        if (parseInt(d.slice(0, 2), 10) < 11) return false;          // DDD nao existe abaixo de 11
        if (d.length === 11 && d.charAt(2) !== '9') return false;    // celular comeca com 9
        if (d.length === 10 && parseInt(d.charAt(2), 10) < 2) return false; // fixo nao comeca com 0 ou 1
        return true;
    }

    function cepValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        return d.length === 8 && !/^(\d)\1{7}$/.test(d);
    }

    // Data real, no passado, de alguem com 18 anos ou mais - idade minima
    // para assinar contrato de consorcio.
    function nascimentoValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        if (d.length !== 8) return false;

        const dia = parseInt(d.slice(0, 2), 10);
        const mes = parseInt(d.slice(2, 4), 10);
        const ano = parseInt(d.slice(4, 8), 10);
        if (mes < 1 || mes > 12 || dia < 1 || ano < 1900) return false;

        const data = new Date(ano, mes - 1, dia);
        // Rejeita 31/02: o Date rola para marco e o dia deixa de bater.
        if (data.getDate() !== dia || data.getMonth() !== mes - 1) return false;

        const hoje = new Date();
        const maioridade = new Date(ano + 18, mes - 1, dia);
        return data < hoje && maioridade <= hoje;
    }

    // Numero da casa: aceita "S/N" de quem nao tem numero.
    function numeroValido(texto) {
        const limpo = String(texto).trim();
        if (/^s\/?n$/i.test(limpo)) return true;
        return /\d/.test(limpo) && limpo.length <= 10;
    }

    // Algoritmo de Luhn - o mesmo que a operadora usa antes de enviar.
    function cartaoValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        if (d.length < 13 || d.length > 19) return false;

        let soma = 0;
        let dobra = false;
        for (let i = d.length - 1; i >= 0; i--) {
            let n = parseInt(d.charAt(i), 10);
            if (dobra) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            soma += n;
            dobra = !dobra;
        }
        return soma % 10 === 0;
    }

    // MM/AA que ainda nao passou. O cartao vale ate o ultimo dia do mes.
    function vencimentoValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        if (d.length !== 4) return false;

        const mes = parseInt(d.slice(0, 2), 10);
        if (mes < 1 || mes > 12) return false;

        const ano = 2000 + parseInt(d.slice(2, 4), 10);
        const hoje = new Date();
        const ultimoDia = new Date(ano, mes, 0);
        return ultimoDia >= new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    }

    function cvcValido(texto) {
        const d = String(texto).replace(/\D/g, '');
        return d.length === 3 || d.length === 4;
    }

    // Liga um campo ao seu aviso: borda vermelha no wrapper e mensagem embaixo.
    function ligarValidacao(idCampo, idWrapper, idErro, valido) {
        const campo = document.getElementById(idCampo);
        const wrapper = document.getElementById(idWrapper);
        const aviso = document.getElementById(idErro);
        if (!campo || !wrapper || !aviso) return null;

        function marcar(mostrar) {
            wrapper.classList.toggle('campo-erro', mostrar);
            aviso.hidden = !mostrar;
        }

        campo.addEventListener('blur', () => {
            const texto = campo.value.trim();
            marcar(texto.length > 0 && !valido(texto));
        });

        campo.addEventListener('input', () => {
            if (wrapper.classList.contains('campo-erro') && valido(campo.value)) marcar(false);
        });

        return { campo: campo, valido: valido, marcar: marcar };
    }

    const CAMPOS_VALIDADOS = [
        ligarValidacao('nomeCompleto', 'nomeWrapper', 'nomeErro', nomeEstaCompleto),
        ligarValidacao('email', 'emailWrapper', 'emailErro', emailValido),
        ligarValidacao('cpf', 'cpfWrapper', 'cpfErro', cpfValido),
        ligarValidacao('telefone', 'telefoneWrapper', 'telefoneErro', telefoneValido),
        ligarValidacao('checkoutCep', 'cepWrapper', 'cepInvalido', cepValido),
        // Checkout
        ligarValidacao('checkoutCpf', 'checkoutCpfWrapper', 'checkoutCpfErro', cpfValido),
        ligarValidacao('checkoutNascimento', 'nascimentoWrapper', 'nascimentoErro', nascimentoValido),
        ligarValidacao('checkoutNumero', 'numeroWrapper', 'numeroErro', numeroValido),
        // Cartao de credito
        ligarValidacao('cartaoNumero', 'cartaoNumeroWrapper', 'cartaoNumeroErro', cartaoValido),
        ligarValidacao('cartaoVencimento', 'cartaoVencWrapper', 'cartaoVencErro', vencimentoValido),
        ligarValidacao('cartaoCvc', 'cartaoCvcWrapper', 'cartaoCvcErro', cvcValido),
        ligarValidacao('cartaoNome', 'cartaoNomeWrapper', 'cartaoNomeErro', nomeEstaCompleto),
        ligarValidacao('cartaoCpf', 'cartaoCpfWrapper', 'cartaoCpfErro', cpfValido)
    ].filter(Boolean);

    // Mostra tudo que estiver errado de uma vez, sem impedir o avanco.
    // Com "dentro", olha so os campos daquele trecho da tela.
    function revisarCampos(dentro) {
        CAMPOS_VALIDADOS
            .filter(c => !dentro || dentro.contains(c.campo))
            .forEach(c => {
                const texto = c.campo.value.trim();
                c.marcar(texto.length > 0 && !c.valido(texto));
            });
    }

    const campoNome = document.getElementById('nomeCompleto');


    function checkStep2Form() {
        let allFilled = true;
        step2Inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        // O botao apaga quando falta algo ou algo esta invalido, mas o clique
        // continua passando - ver o listener mais abaixo.
        const tudoValido = CAMPOS_VALIDADOS
            .filter(c => c.campo.closest('.step2-form'))
            .every(c => c.valido(c.campo.value));

        if (allFilled && tudoValido) {
            btnProximaEtapa.classList.remove("btn-disabled");
            // btn-primary já tem a cor vermelha quando não tem btn-disabled
        } else {
            btnProximaEtapa.classList.add("btn-disabled");
        }
    }

    step2Inputs.forEach((input, index) => {
        input.addEventListener("input", checkStep2Form);
        input.addEventListener("blur", checkStep2Form);

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



    // O header e o mesmo nas telas 1, 2 e 3. Nas duas de dentro do fluxo ele
    // troca o menu por uma seta de voltar (Figma 8043:4929), e cada uma volta
    // para a anterior. Na tela inicial continua sendo o menu.
    const logoAdemicon = document.getElementById("logoAdemicon");
    const iconeHeader = logoAdemicon && logoAdemicon.querySelector('img');

    function telaAtualDoFluxo() {
        const step3 = document.getElementById('step3');
        if (step2 && step2.style.display !== 'none') return 'step2';
        if (step3 && step3.style.display !== 'none') return 'step3';
        return 'step1';
    }

    function atualizarIconeHeader() {
        if (!iconeHeader) return;
        const podeVoltar = telaAtualDoFluxo() !== 'step1';
        iconeHeader.src = podeVoltar ? 'assets/icon-arrow-left.svg' : 'assets/menu.svg';
        iconeHeader.alt = podeVoltar ? 'Voltar' : 'Menu';
        logoAdemicon.setAttribute('aria-label', podeVoltar ? 'Voltar' : 'Menu');
    }

    if (logoAdemicon) {
        logoAdemicon.addEventListener("click", () => {
            const step3 = document.getElementById('step3');
            const atual = telaAtualDoFluxo();

            // Vindo da revisao do checkout, a seta desfaz a edicao em vez de
            // sair do fluxo e deixar o checkout num estado pela metade.
            if (atual === 'step2' && modoEdicao) {
                voltarParaRevisao();
                return;
            }

            if (atual === 'step3') {
                step3.style.display = 'none';
                step2.style.display = 'flex';
            } else if (atual === 'step2') {
                step2.style.display = 'none';
                step1.style.display = 'flex'; // usa div normal, entao main é block
            }
            window.scrollTo(0, 0);
        });
    }

    // Observamos as duas telas em vez de espalhar a troca do icone pelos
    // varios pontos do codigo que mostram ou escondem cada uma.
    if (iconeHeader) {
        const observador = new MutationObserver(atualizarIconeHeader);
        ['step2', 'step3'].forEach(id => {
            const tela = document.getElementById(id);
            if (tela) observador.observe(tela, { attributes: true, attributeFilter: ['style'] });
        });
        atualizarIconeHeader();
    }




    // === Transição Etapa 2 -> Etapa 3 ===
    const step3 = document.getElementById('step3');
    window.appData = { produto: 'imóvel', nome: '', email: '', cpf: '', telefone: '', nascimento: '', genero: '', estadoCivil: '', renda: '', profissao: '', cep: '', endereco: null, numero: '', complemento: '', semComplemento: false, pagamento: 'Pix' };

    function capturarEtapa2() {
        const campos = document.querySelectorAll('.step2-form .input-field');
        window.appData.nome = campos[0].value.trim();
        window.appData.email = campos[1].value.trim();
        window.appData.cpf = campos[2].value.trim();
        window.appData.telefone = campos[3].value.trim();
    }

    if(btnProximaEtapa) {
        btnProximaEtapa.addEventListener('click', () => {
            // Mostra os erros mas deixa passar: o cliente precisa conseguir
            // percorrer o fluxo inteiro para validar o protótipo.
            revisarCampos();

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
            // Em "partes" porque este texto tem subtitulos em negrito. Os
            // outros modais seguem no formato antigo, so com "text".
            partes: [
                'A Taxa Administrativa é o valor destinado à gestão dos grupos de consorciados. No simulador, mostramos uma média mensal para facilitar a comparação, mas ela não reflete a forma exata de cobrança.\n\n',
                { forte: 'Como a taxa é cobrada?' },
                '\n\nA cobrança real ocorre no início do plano, sendo o valor total diluído e arrecadado nas parcelas.\n\n',
                { forte: 'Qual é a taxa total?' },
                '\n\nA Taxa Administrativa Total estabelecida em contrato para este plano é de 24%.'
            ]
        },
        parcelaReduzida: {
            title: 'Parcela reduzida',
            text: 'Com a parcela reduzida, você começa pagando um valor menor e só assume a parcela cheia depois da contemplação.\n\nPor exemplo: para um crédito de R$ 380mil, você pode pagar R$ 451 por mês.\n\nSe for contemplado no 15º mês, por exemplo, a partir do 16º mês a sua parcela passa a ser R$ 903. A diferença é diluída nas parcelas restantes.\n\nOs valores e prazos variam conforme o grupo e o momento da contemplação.'
        }
    };

    // Monta o corpo do modal por no, sem innerHTML: com "partes", os itens
    // { forte } viram <strong>; sem elas, cai no texto corrido de sempre.
    function preencherTextoModal(dados) {
        infoModalText.textContent = '';
        if (!dados.partes) {
            infoModalText.textContent = dados.text || '';
            return;
        }
        dados.partes.forEach(parte => {
            if (typeof parte === 'string') {
                infoModalText.appendChild(document.createTextNode(parte));
                return;
            }
            const forte = document.createElement('strong');
            forte.textContent = parte.forte;
            infoModalText.appendChild(forte);
        });
    }

    const helpIcons = document.querySelectorAll('.icon-help-wrapper');
    helpIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita clicar no card acidentalmente
            const type = icon.getAttribute('data-modal');
            if(modalData[type]) {
                infoModalTitle.textContent = modalData[type].title;
                preencherTextoModal(modalData[type]);
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


    // === Falar com especialista ===
    // O mapa de unidades saiu em 2026-08-31 e virou peca isolada em
    // /unidades/. O contato passou pelo WhatsApp e hoje leva para a tela de
    // aviso: um especialista entra em contato.
    const globalHeader = document.getElementById('globalHeader');
    const especialista = document.getElementById('especialista');
    const especialistaHeader = document.getElementById('especialistaHeader');

    // A tela e alcancada de dentro e de fora do checkout. Em vez de saber de
    // onde veio, ela guarda o que estava visivel e restaura na volta.
    const TELAS_TROCAVEIS = ['globalHeader', 'checkoutHeader', 'step1', 'step2', 'step3', 'checkoutStep1'];
    let telaAnteriorEspecialista = null;

    function falarComEspecialista() {
        if (!especialista) return;

        telaAnteriorEspecialista = {
            visiveis: TELAS_TROCAVEIS
                .map(id => document.getElementById(id))
                .filter(el => el && el.style.display !== 'none')
                .map(el => [el.id, el.style.display]),
            noCheckout: document.documentElement.classList.contains('checkout-ativo')
        };

        // O modo checkout prende o container na altura do visualViewport;
        // esta tela rola normal, entao ele sai enquanto ela esta no ar.
        sairDoCheckout();
        telaAnteriorEspecialista.visiveis.forEach(([id]) => {
            document.getElementById(id).style.display = 'none';
        });
        especialistaHeader.style.display = 'flex';
        especialista.style.display = 'flex';
        window.scrollTo(0, 0);
    }

    function voltarDoEspecialista() {
        if (!telaAnteriorEspecialista) return;
        especialistaHeader.style.display = 'none';
        especialista.style.display = 'none';
        telaAnteriorEspecialista.visiveis.forEach(([id, exibicao]) => {
            document.getElementById(id).style.display = exibicao;
        });
        if (telaAnteriorEspecialista.noCheckout) entrarNoCheckout();
        telaAnteriorEspecialista = null;
        window.scrollTo(0, 0);
    }

    // Depois do contrato assinado, o atendimento e imediato: vai direto para
    // o WhatsApp da central, em vez da tela de "vamos entrar em contato".
    const WHATSAPP_ATENDIMENTO = 'https://api.whatsapp.com/send/?phone=554130232000';

    function abrirWhatsApp() {
        window.open(WHATSAPP_ATENDIMENTO, '_blank', 'noopener');
    }

    const btnEspecialista = document.getElementById('btnEspecialista');
    if (btnEspecialista) btnEspecialista.addEventListener('click', falarComEspecialista);

    ['btnVoltarEspecialista', 'btnEntendiEspecialista'].forEach(id => {
        const botao = document.getElementById(id);
        if (botao) botao.addEventListener('click', voltarDoEspecialista);
    });

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

        // O valor da parcela so aparece no rodape da tela do cartao
        const rodapeParcela = document.getElementById('rodapeParcela');
        if (rodapeParcela) {
            rodapeParcela.hidden = etapas[indice].dataset.etapa !== 'cartao';
        }

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
        // CEP com formato invalido ja mostra o proprio aviso; nao adianta
        // consultar o ViaCEP nem empilhar uma segunda mensagem embaixo.
        if (!cepValido(cep)) return;

        if (cepErro) { cepErro.hidden = true; cepErro.textContent = ''; }

        let dados = null;
        try {
            const resposta = await fetch('https://viacep.com.br/ws/' + digitos + '/json/');
            const json = await resposta.json();
            if (!json.erro && json.logradouro) dados = json;
        } catch (e) {
            // offline ou API fora do ar: segue para o exemplo
        }

        // A resposta demora: se o campo ja mudou nesse meio tempo, esta
        // consulta ficou velha e nao pode escrever por cima do estado atual.
        if (checkoutCep && checkoutCep.value.replace(/\D/g, '') !== digitos) return;

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
            // CEP invalido: limpa o aviso do ViaCEP para nao ficarem duas
            // mensagens empilhadas embaixo do campo.
            if (!cepValido(checkoutCep.value)) {
                if (cepErro) { cepErro.hidden = true; cepErro.textContent = ''; }
                return;
            }
            buscarCep(checkoutCep.value);
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
    const TOTAL_TELAS_CHECKOUT = 14;

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

            // O lapis e decorativo: a linha inteira ja e o botao de editar.
            const lapis = document.createElement('img');
            lapis.className = 'revisao-editar';
            lapis.src = 'assets/icon-edit.svg';
            lapis.alt = '';

            item.append(rotulo, valor, lapis);
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

    // O fluxo deixa de ser linear a partir do pagamento: Pix vai para o QR,
    // cartao vai para o formulario. Por isso navegamos pelo nome da etapa,
    // nao por "indice + 1".
    function indiceDaEtapa(nome) {
        return etapas.findIndex(s => s.dataset.etapa === nome);
    }

    function irParaEtapaNomeada(nome) {
        const destino = indiceDaEtapa(nome);
        if (destino >= 0) irParaEtapa(destino);
    }

    function gerarCodigoPix() {
        const botao = document.getElementById('btnNextCheckout');
        animarBotaoProgresso(botao, {
            viraCirculo: true,
            aoTerminar: () => irParaEtapaNomeada('pix')
        });
    }

    // Mesma animacao do Pix, com outro rotulo e outro destino.
    function processarCartao() {
        const botao = document.getElementById('btnNextCheckout');
        animarBotaoProgresso(botao, {
            texto: 'Processando pagamento',
            viraCirculo: true,
            aoTerminar: () => irParaEtapaNomeada('conclusao')
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
            revisarCampos(secao); // mostra o que esta errado, mas deixa passar

            if (secao.dataset.etapa === 'pagamento') {
                if (window.appData.pagamento === 'Pix') gerarCodigoPix();
                else irParaEtapaNomeada('cartao');
                return;
            }
            if (secao.dataset.etapa === 'cartao') {
                processarCartao();
                return;
            }

            irParaEtapa(etapaAtual + 1);
        });
    }

    if (btnBackToStep3FromCheckout) {
        btnBackToStep3FromCheckout.addEventListener('click', () => {
            if (modoEdicao) { voltarParaRevisao(); return; }
            // O QR do Pix vem do pagamento, nao da tela do cartao que o
            // antecede na ordem do HTML.
            if (etapas[etapaAtual].dataset.etapa === 'pix') {
                irParaEtapaNomeada('pagamento');
                return;
            }
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
    function irParaPropostas() {
        sairDoCheckout();
        checkoutStep1.style.display = 'none';
        checkoutHeader.style.display = 'none';
        globalHeader.style.display = 'flex';
        document.getElementById('step3').style.display = 'flex';
        window.scrollTo(0, 0);
    }

    if (btnAccordionUnidade) {
        btnAccordionUnidade.addEventListener('click', falarComEspecialista);
    }

    // Mesmos destinos nas telas do PIX e da conclusao
    [
        ['btnPixEspecialista', falarComEspecialista],
        ['btnConclusaoEspecialista', abrirWhatsApp],
        ['btnPixPropostas', irParaPropostas]
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