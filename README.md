# UNINASSAU — Saúde em Foco

## Sobre o projeto

**UNINASSAU — Saúde em Foco** é um site *one-page* desenvolvido como trabalho acadêmico da disciplina de **Desenvolvimento Web**. O tema sorteado para o grupo foi **Saúde**.

O objetivo é incentivar o visitante a adotar hábitos mais saudáveis, com uma linguagem simples e um visual moderno. O site apresenta os benefícios de uma vida saudável (alimentação, movimento, sono e saúde mental) e traz um **quiz interativo** que mostra quais áreas da rotina podem receber mais atenção.

> ⚠️ **Aviso:** o conteúdo é educativo e traz apenas orientações gerais de hábitos saudáveis. O quiz **não é um diagnóstico** e **não substitui a avaliação de um profissional de saúde**.

## Tecnologias utilizadas

- **HTML5** (elementos semânticos: `header`, `nav`, `main`, `section`, `article`, `footer`)
- **CSS3** (variáveis CSS, Grid, Flexbox, animações e Media Queries)
- **JavaScript** puro (sem frameworks e sem bibliotecas)
- Google Fonts (Outfit, Plus Jakarta Sans e Caveat)

## Funcionalidades

- Navegação por seções (âncoras) com header fixo
- Quiz interativo com 8 perguntas
- Cálculo de resultado por área (hidratação, atividade física, sono, alimentação e saúde mental)
- Feedback ao usuário: resultado personalizado, sem recarregar a página
- Validação das respostas (não avança sem escolher uma opção, com mensagem amigável)
- Menu responsivo com botão hambúrguer
- Scroll suave entre as seções
- Animações discretas de entrada ao rolar a página
- Design responsivo (desktop, notebook, tablet e celular)
- Acessibilidade básica: foco visível, `aria-*`, link "pular para o conteúdo" e respeito à preferência por menos movimento

## Estrutura do projeto

```
projeto-saude/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── assets/
    ├── images/
    │   ├── hero.svg
    │   ├── equipe-Arthur.svg
    │   ├── equipe-João victor.svg
    │   ├── equipe-Bruni.svg
    └── icons/
        ├── logo.svg
        └── favicon.svg
```

## Como o quiz calcula o resultado

1. Cada resposta vale pontos (quanto melhor o hábito, mais pontos).
2. Cada pergunta pertence a uma **área** (por exemplo, a pergunta sobre água pertence a *Hidratação*).
3. O JavaScript soma os pontos de cada área e converte em porcentagem.
4. As áreas são ordenadas da que mais precisa de atenção para a que está melhor:
   - abaixo de 50%: **Precisa de atenção**
   - de 50% a 74%: **Pode melhorar**
   - 75% ou mais: **Ponto forte**

Para mudar perguntas, respostas ou pontuação, edite o array `perguntas` em `js/script.js`.

## Como personalizar

- **Equipe (nomes, funções e fotos):** em `index.html`, procure pelos comentários `EDITE AQUI` na seção Equipe. Para usar fotos reais, coloque os arquivos em `assets/images/` e troque o `src` de cada `<img>`.
- **Imagem do Hero:** troque `assets/images/hero.svg` por uma foto (por exemplo `hero.jpg`) e atualize o `src` no `index.html`.
- **Cores:** edite as variáveis no início de `css/style.css` (bloco `:root`).
- **Redes sociais:** troque os links no rodapé do `index.html`.

## Equipe

| Nome | Função |
|------|--------|
|ARTHUR MARQUES | BACK-END |
| JOÃO VICTOR | FRONT-END |
| BRUNO | UX/UI DESIGN |





## GitHub

Repositório: _(cole aqui o link do repositório)_

## Créditos

Projeto acadêmico
