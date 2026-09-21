/* =========================================================
   UNINASSAU — Saúde em Foco
   Arquivo JavaScript principal

   Índice:
   0. Preparação
   1. Menu mobile (hambúrguer)
   2. Scroll suave
   3. Header com sombra + link ativo do menu
   4. Animações de entrada ao rolar
   5. Quiz de saúde
      5.1 Perguntas e áreas (edite aqui para mudar o quiz)
      5.2 Estado do quiz
      5.3 Mostrar pergunta e progresso
      5.4 Validação (mensagem amigável)
      5.5 Cálculo do resultado
      5.6 Mostrar resultado
      5.7 Eventos do quiz
   ========================================================= */

'use strict';


/* =========================================================
   0. PREPARAÇÃO
   ========================================================= */

// Avisa o CSS que o JavaScript está funcionando.
// (As animações de entrada só "escondem" os elementos se essa classe existir.)
document.documentElement.classList.add('js');

// Verifica se a pessoa prefere menos animações (acessibilidade).
const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* =========================================================
   1. MENU MOBILE (INTERAÇÃO 2)
   - No celular, o botão hambúrguer abre e fecha o menu.
   - Ao clicar em um link, o menu fecha.
   ========================================================= */
const botaoMenu = document.getElementById('menu-toggle');
const listaMenu = document.getElementById('menu-principal');

// Abre (aberto = true) ou fecha (aberto = false) o menu
function definirMenu(aberto) {
  listaMenu.classList.toggle('is-open', aberto);
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

// Clique no hambúrguer: alterna entre aberto e fechado
botaoMenu.addEventListener('click', () => {
  const estaAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
  definirMenu(!estaAberto);
});

// Clique em qualquer link do menu: fecha o menu
listaMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => definirMenu(false));
});

// Tecla ESC fecha o menu e devolve o foco ao botão
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && listaMenu.classList.contains('is-open')) {
    definirMenu(false);
    botaoMenu.focus();
  }
});

// Clique fora do menu também fecha
document.addEventListener('click', (evento) => {
  const clicouFora = !listaMenu.contains(evento.target) && !botaoMenu.contains(evento.target);
  if (clicouFora) definirMenu(false);
});

// Se a tela voltar a ser grande (desktop), garante que o menu volte ao normal
window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
  if (e.matches) definirMenu(false);
});


/* =========================================================
   2. SCROLL SUAVE (INTERAÇÃO 4)
   Vale para o menu, o botão do Hero, o rodapé e o logo.
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    const idDestino = link.getAttribute('href');

    // Ignora links vazios como href="#"
    if (idDestino.length < 2) return;

    const destino = document.querySelector(idDestino);
    if (!destino) return;

    evento.preventDefault();

    // Rola até a seção (o CSS "scroll-padding-top" compensa a altura do header)
    destino.scrollIntoView({
      behavior: prefereMenosMovimento ? 'auto' : 'smooth',
      block: 'start',
    });

    // Atualiza o endereço (#quiz, #equipe...) sem recarregar a página
    try {
      history.pushState(null, '', idDestino);
    } catch (erro) {
      // Alguns navegadores bloqueiam isso ao abrir o arquivo direto do computador. Sem problema.
    }

    // Acessibilidade: leva o foco do teclado para a seção de destino
    destino.setAttribute('tabindex', '-1');
    destino.focus({ preventScroll: true });
  });
});


/* =========================================================
   3. HEADER COM SOMBRA + LINK ATIVO DO MENU
   ========================================================= */
const header = document.querySelector('.site-header');

// Coloca uma sombra no header quando a página deixa de estar no topo
function atualizarHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', atualizarHeader, { passive: true });
atualizarHeader();

// Destaca no menu a seção que está na tela
const linksDoMenu = document.querySelectorAll('.nav__link');
const secoes = document.querySelectorAll('main section[id]');

if ('IntersectionObserver' in window) {
  const observadorDeSecoes = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        linksDoMenu.forEach((link) => {
          const ehDestaSecao = link.getAttribute('href') === '#' + entrada.target.id;
          if (ehDestaSecao) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    // Considera "ativa" a seção que cruza a linha do meio da tela
    { rootMargin: '-45% 0px -50% 0px' }
  );
  secoes.forEach((secao) => observadorDeSecoes.observe(secao));
}


/* =========================================================
   4. ANIMAÇÕES DE ENTRADA AO ROLAR
   Elementos com a classe "reveal" aparecem quando entram na tela.
   ========================================================= */
const elementosReveal = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefereMenosMovimento) {
  const observadorReveal = new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('is-visible');
          observador.unobserve(entrada.target); // anima só uma vez
        }
      });
    },
    { threshold: 0.15 }
  );
  elementosReveal.forEach((el) => observadorReveal.observe(el));
} else {
  // Navegador antigo ou preferência por menos movimento: mostra tudo direto
  elementosReveal.forEach((el) => el.classList.add('is-visible'));
}


/* =========================================================
   5. QUIZ DE SAÚDE (INTERAÇÕES 1 e 3)
   ========================================================= */

/* ---------------------------------------------------------
   5.1 PERGUNTAS E ÁREAS
   Para mudar o quiz, edite os objetos abaixo:
   - "area": a qual área da saúde a pergunta pertence
   - "pontos": quanto vale cada resposta (maior = hábito melhor)
   --------------------------------------------------------- */

// Textos que aparecem no resultado de cada área
const areas = {
  hidratacao: {
    emoji: '💧',
    nome: 'Hidratação',
    dica: 'Você pode tentar aumentar o consumo de água ao longo do dia.',
    positivo: 'Muito bem! Manter a água por perto ajuda a criar esse hábito todos os dias.',
  },
  atividade: {
    emoji: '🏃',
    nome: 'Atividade física',
    dica: 'Procure incluir mais movimento na sua rotina.',
    positivo: 'Ótimo! Seu corpo agradece o movimento. Continue variando as atividades.',
  },
  sono: {
    emoji: '😴',
    nome: 'Sono',
    dica: 'Uma rotina regular de sono pode ajudar no descanso e na disposição.',
    positivo: 'Legal! Manter horários regulares de sono ajuda a preservar esse resultado.',
  },
  alimentacao: {
    emoji: '🥗',
    nome: 'Alimentação',
    dica: 'Priorize alimentos naturais e tente reduzir o consumo de ultraprocessados.',
    positivo: 'Boa! Continue priorizando alimentos naturais no seu dia a dia.',
  },
  mental: {
    emoji: '🧠',
    nome: 'Saúde mental',
    dica: 'Reserve momentos para descanso, lazer e atividades que promovam bem-estar.',
    positivo: 'Que bom! Continue reservando tempo para o que faz bem a você.',
  },
};

const perguntas = [
  {
    area: 'hidratacao',
    texto: 'Quantos litros de água você bebe por dia?',
    opcoes: [
      { texto: 'Menos de 1 litro', pontos: 0 },
      { texto: 'Entre 1 e 2 litros', pontos: 1 },
      { texto: 'Mais de 2 litros', pontos: 2 },
    ],
  },
  {
    area: 'atividade',
    texto: 'Com que frequência você pratica exercícios físicos?',
    opcoes: [
      { texto: 'Nunca', pontos: 0 },
      { texto: '1–2 vezes por semana', pontos: 1 },
      { texto: '3–4 vezes por semana', pontos: 2 },
      { texto: '5 vezes ou mais', pontos: 3 },
    ],
  },
  {
    area: 'sono',
    texto: 'Quantas horas você costuma dormir por noite?',
    opcoes: [
      { texto: 'Menos de 5 horas', pontos: 0 },
      { texto: '5–6 horas', pontos: 1 },
      { texto: '7–8 horas', pontos: 3 },
      { texto: 'Mais de 8 horas', pontos: 2 },
    ],
  },
  {
    area: 'atividade',
    texto: 'Quantas horas por dia você costuma ficar sentado?',
    opcoes: [
      { texto: 'Menos de 4 horas', pontos: 3 },
      { texto: '4–6 horas', pontos: 2 },
      { texto: '6–8 horas', pontos: 1 },
      { texto: 'Mais de 8 horas', pontos: 0 },
    ],
  },
  {
    area: 'alimentacao',
    texto: 'Como você avalia sua alimentação?',
    opcoes: [
      { texto: 'Preciso melhorar bastante', pontos: 0 },
      { texto: 'Poderia melhorar', pontos: 1 },
      { texto: 'Boa', pontos: 2 },
      { texto: 'Muito boa', pontos: 3 },
    ],
  },
  {
    area: 'alimentacao',
    texto: 'Com que frequência você consome frutas e verduras?',
    opcoes: [
      { texto: 'Raramente', pontos: 0 },
      { texto: 'Algumas vezes por semana', pontos: 1 },
      { texto: 'Todos os dias', pontos: 2 },
    ],
  },
  {
    area: 'mental',
    texto: 'Com que frequência você pratica alguma atividade para relaxar ou cuidar da saúde mental?',
    opcoes: [
      { texto: 'Nunca', pontos: 0 },
      { texto: 'Raramente', pontos: 1 },
      { texto: 'Algumas vezes por semana', pontos: 2 },
      { texto: 'Frequentemente', pontos: 3 },
    ],
  },
  {
    area: 'alimentacao',
    texto: 'Com que frequência você consome alimentos ultraprocessados?',
    opcoes: [
      { texto: 'Todos os dias', pontos: 0 },
      { texto: 'Frequentemente', pontos: 1 },
      { texto: 'Algumas vezes', pontos: 2 },
      { texto: 'Raramente', pontos: 3 },
    ],
  },
];


/* ---------------------------------------------------------
   Elementos do HTML usados pelo quiz
   --------------------------------------------------------- */
const cartaoQuiz = document.getElementById('quiz-card');
const painelQuiz = document.getElementById('quiz-panel');
const formQuiz = document.getElementById('quiz-form');
const textoPasso = document.getElementById('quiz-step');
const textoPercentual = document.getElementById('quiz-percent');
const barraProgresso = document.getElementById('quiz-bar');
const progressoAcessivel = document.getElementById('quiz-progress');
const tituloPergunta = document.getElementById('quiz-question');
const listaOpcoes = document.getElementById('quiz-options');
const mensagemQuiz = document.getElementById('quiz-message');
const botaoVoltar = document.getElementById('btn-prev');
const botaoProxima = document.getElementById('btn-next');

const painelResultado = document.getElementById('quiz-result');
const tituloResultado = document.getElementById('result-title');
const resumoResultado = document.getElementById('result-summary');
const notaGeral = document.getElementById('result-score');
const barraGeral = document.getElementById('result-bar');
const focoResultado = document.getElementById('result-focus');
const listaAreas = document.getElementById('result-areas');
const botaoRefazer = document.getElementById('btn-restart');


/* ---------------------------------------------------------
   5.2 ESTADO DO QUIZ
   --------------------------------------------------------- */
let indiceAtual = 0;   // número da pergunta atual (começa em 0)
let respostas = [];    // guarda o índice da opção escolhida em cada pergunta


/* ---------------------------------------------------------
   5.3 MOSTRAR PERGUNTA E PROGRESSO
   --------------------------------------------------------- */
function mostrarPergunta() {
  const pergunta = perguntas[indiceAtual];
  const total = perguntas.length;

  // Título da pergunta
  tituloPergunta.textContent = pergunta.texto;

  // Cria uma opção (input radio + texto) para cada resposta possível
  listaOpcoes.innerHTML = '';
  pergunta.opcoes.forEach((opcao, posicao) => {
    const rotulo = document.createElement('label');
    rotulo.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'resposta';
    radio.value = posicao;
    radio.checked = respostas[indiceAtual] === posicao; // lembra a resposta se o usuário voltou

    const marca = document.createElement('span');
    marca.className = 'option__mark';

    const texto = document.createElement('span');
    texto.className = 'option__text';
    texto.textContent = opcao.texto;

    rotulo.append(radio, marca, texto);
    listaOpcoes.appendChild(rotulo);
  });

  // Progresso: "Pergunta 3 de 8" + barra
  const percentual = Math.round(((indiceAtual + 1) / total) * 100);
  textoPasso.textContent = `Pergunta ${indiceAtual + 1} de ${total}`;
  textoPercentual.textContent = `${percentual}%`;
  barraProgresso.style.width = `${percentual}%`;
  progressoAcessivel.setAttribute('aria-valuenow', percentual);

  // Botões: esconde "Voltar" na primeira pergunta e muda o texto na última
  botaoVoltar.hidden = indiceAtual === 0;
  botaoProxima.textContent = indiceAtual === total - 1 ? 'Ver resultado' : 'Próxima';

  esconderMensagem();
}


/* ---------------------------------------------------------
   5.4 VALIDAÇÃO (INTERAÇÃO 3)
   Impede de avançar sem escolher uma opção.
   --------------------------------------------------------- */
function mostrarMensagem(texto) {
  mensagemQuiz.textContent = texto;
  mensagemQuiz.hidden = false;

  // Reinicia a animação de "tremer" nas opções
  listaOpcoes.classList.remove('has-error');
  void listaOpcoes.offsetWidth; // força o navegador a recalcular (truque para repetir a animação)
  listaOpcoes.classList.add('has-error');
}

function esconderMensagem() {
  mensagemQuiz.hidden = true;
  listaOpcoes.classList.remove('has-error');
}

function usuarioRespondeu() {
  return respostas[indiceAtual] !== undefined;
}


/* ---------------------------------------------------------
   5.5 CÁLCULO DO RESULTADO (INTERAÇÃO 1)
   Soma os pontos por área e transforma em porcentagem.
   --------------------------------------------------------- */

// Transforma uma porcentagem em um nível
function classificar(percentual) {
  if (percentual < 50) return 'atencao';
  if (percentual < 75) return 'melhorar';
  return 'bom';
}

function calcularResultado() {
  const totaisPorArea = {};   // exemplo: { sono: { pontos: 3, maximo: 3 } }
  let pontosGeral = 0;
  let maximoGeral = 0;

  perguntas.forEach((pergunta, i) => {
    const opcaoEscolhida = pergunta.opcoes[respostas[i]];
    const pontosPossiveis = pergunta.opcoes.map((o) => o.pontos);
    const maximo = Math.max(...pontosPossiveis);

    if (!totaisPorArea[pergunta.area]) {
      totaisPorArea[pergunta.area] = { pontos: 0, maximo: 0 };
    }
    totaisPorArea[pergunta.area].pontos += opcaoEscolhida.pontos;
    totaisPorArea[pergunta.area].maximo += maximo;

    pontosGeral += opcaoEscolhida.pontos;
    maximoGeral += maximo;
  });

  // Monta a lista de áreas com percentual e nível
  const listaDeAreas = Object.keys(totaisPorArea).map((id) => {
    const percentual = Math.round((totaisPorArea[id].pontos / totaisPorArea[id].maximo) * 100);
    return { id, percentual, nivel: classificar(percentual) };
  });

  // Ordena da área que mais precisa de atenção para a que está melhor
  listaDeAreas.sort((a, b) => a.percentual - b.percentual);

  return {
    geral: Math.round((pontosGeral / maximoGeral) * 100),
    areas: listaDeAreas,
  };
}

// Mensagem principal, de acordo com a pontuação geral
function mensagemGeral(percentual) {
  if (percentual >= 75) {
    return 'Você já cultiva hábitos bem positivos! Vale manter a constância e olhar com carinho para os detalhes abaixo.';
  }
  if (percentual >= 50) {
    return 'Você já possui alguns hábitos positivos, mas existem áreas que podem ser melhoradas.';
  }
  return 'Sua rotina tem bastante espaço para pequenas melhorias. Comece por um hábito de cada vez: cada passo conta!';
}

const rotulosDeNivel = {
  atencao: 'Precisa de atenção',
  melhorar: 'Pode melhorar',
  bom: 'Ponto forte',
};


/* ---------------------------------------------------------
   5.6 MOSTRAR RESULTADO (atualiza a página sem recarregar)
   --------------------------------------------------------- */
function mostrarResultado() {
  const resultado = calcularResultado();

  // Mensagem e pontuação geral
  resumoResultado.textContent = mensagemGeral(resultado.geral);
  notaGeral.textContent = `${resultado.geral}%`;

  // Texto que resume onde focar (áreas abaixo de 75%)
  const precisamDeAtencao = resultado.areas.filter((a) => a.nivel !== 'bom');
  if (precisamDeAtencao.length === 0) {
    focoResultado.textContent = 'Nenhuma área precisa de atenção especial agora. Continue assim!';
  } else {
    const nomes = precisamDeAtencao.slice(0, 3).map((a) => areas[a.id].nome.toLowerCase());
    const nomesEmTexto = nomes.length > 1
      ? nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1]
      : nomes[0];
    focoResultado.textContent = `Para começar, vale dar mais atenção a: ${nomesEmTexto}.`;
  }

  // Cria um item de lista para cada área
  listaAreas.innerHTML = '';
  resultado.areas.forEach((item) => {
    const info = areas[item.id];
    const texto = item.nivel === 'bom' ? info.positivo : info.dica;

    const li = document.createElement('li');
    li.className = `area area--${item.nivel}`;
    li.innerHTML = `
      <span class="area__emoji" aria-hidden="true">${info.emoji}</span>
      <div>
        <div class="area__head">
          <h4 class="area__name">${info.nome}</h4>
          <span class="badge badge--${item.nivel}">${rotulosDeNivel[item.nivel]}</span>
        </div>
        <p class="area__text">${texto}</p>
      </div>
    `;
    listaAreas.appendChild(li);
  });

  // Troca a tela das perguntas pela tela do resultado
  painelQuiz.hidden = true;
  painelResultado.hidden = false;

  // Anima a barra geral (começa em 0 e vai até o valor)
  barraGeral.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barraGeral.style.width = `${resultado.geral}%`;
    });
  });

  // Leva o usuário até o início do resultado
  cartaoQuiz.scrollIntoView({ behavior: prefereMenosMovimento ? 'auto' : 'smooth', block: 'start' });
  tituloResultado.focus({ preventScroll: true });
}

function reiniciarQuiz() {
  respostas = [];
  indiceAtual = 0;
  painelResultado.hidden = true;
  painelQuiz.hidden = false;
  mostrarPergunta();
  cartaoQuiz.scrollIntoView({ behavior: prefereMenosMovimento ? 'auto' : 'smooth', block: 'start' });
}


/* ---------------------------------------------------------
   5.7 EVENTOS DO QUIZ
   --------------------------------------------------------- */

// Quando o usuário escolhe uma opção: registra a resposta
listaOpcoes.addEventListener('change', (evento) => {
  respostas[indiceAtual] = Number(evento.target.value);
  esconderMensagem();
});

// Botão "Próxima" / "Ver resultado" (envio do formulário)
formQuiz.addEventListener('submit', (evento) => {
  evento.preventDefault(); // não recarrega a página

  // Validação: só avança se houver resposta
  if (!usuarioRespondeu()) {
    mostrarMensagem('Escolha uma opção para continuar. Não existe resposta certa ou errada: é só o retrato da sua rotina.');
    const primeiraOpcao = listaOpcoes.querySelector('input');
    if (primeiraOpcao) primeiraOpcao.focus();
    return;
  }

  if (indiceAtual < perguntas.length - 1) {
    indiceAtual++;
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

// Botão "Voltar"
botaoVoltar.addEventListener('click', () => {
  if (indiceAtual > 0) {
    indiceAtual--;
    mostrarPergunta();
  }
});

// Botão "Refazer o quiz"
botaoRefazer.addEventListener('click', reiniciarQuiz);

// Começa o quiz mostrando a primeira pergunta
mostrarPergunta();
