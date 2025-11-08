Crie uma aplicação completa chamada “Chute Certo”, com o mesmo conceito do site https://www.baamboozle.com
, seguindo as instruções abaixo:

🎯 Objetivo

O Chute Certo é um jogo de perguntas e respostas em grupo.
O usuário pode:

Fazer login.

Cadastrar um jogo (com título e descrição).

Adicionar perguntas e respostas de múltipla escolha.

Jogar o jogo com dois times (Time 1 e Time 2), alternando entre eles para escolher perguntas e acumular pontos.

⚙️ Tecnologias obrigatórias

Next.js 15 (App Router)

TypeScript

Tailwind CSS

Shadcn/UI

Supabase (autenticação, banco e storage)

🎨 Design e UX

Estilo: Minimalista e divertido, remetendo a brincadeiras de infância (cores suaves, tipografia amigável, bordas arredondadas).

UI: Usar componentes do Shadcn/UI para consistência visual.

Layout: Centralizado, limpo e responsivo.

🧩 Funcionalidades principais
1. Autenticação

Login e cadastro de usuário via Supabase Auth.

Após login, o usuário é redirecionado à página inicial com seus jogos cadastrados.

2. Página Inicial (/)

Exibir os cards dos jogos cadastrados pelo usuário.

Cada card mostra:

Título

Descrição

Botão “Jogar”

Botão “Editar”

Botão “+ Criar novo jogo”.

3. Cadastro de novo jogo (/create)

Formulário com:

Input Título (obrigatório)

Input Descrição (opcional)

Botão “Criar”

➡️ Ao criar o jogo, redirecionar para a página de cadastro de perguntas e respostas.

4. Cadastro de Perguntas (/game/[id]/questions)

Campo para digitar a pergunta.

Inputs dinâmicos para adicionar múltiplas respostas.

O usuário pode adicionar/remover quantos inputs quiser.

Selecionar qual é a resposta correta (ex: radio button).

Botão “Salvar pergunta”.

Após salvar:

Mostrar abaixo uma prévia da pergunta e suas opções cadastradas.

5. Tela do Jogo (/game/[id]/play)

Layout:

Parte superior:

Time 1 e Time 2 com campo editável (botão “Editar nomes”).

Mostrar pontuação atual de cada time.

Parte central:

Cards numerados (um para cada pergunta).

Cards ocupam a tela inteira dividida igualmente.

Alguns cards podem conter pegadinhas (ganhar/perder pontos).

Fluxo do jogo:

Time 1 inicia.

Escolhe um número (card).

Ao clicar, aparece a pergunta correspondente.

Botão “Mostrar resposta” revela a resposta correta.

Se acertar → clicar em “Acertou” (incrementa pontos do time atual).

Se errar → clicar em “Errou” (sem ponto).

Alterna o turno para o outro time.

Quando todas as perguntas forem usadas → mostrar tela de resultado (“Empate”, “Time 1 venceu” ou “Time 2 venceu”).



💾 Extras

Utilizar Server Components e Server Actions para integração com Supabase.

Estruturar o projeto com boas práticas de arquitetura em Next.js (ex: /app, /components, /lib, /types).

Criar componentes reutilizáveis para Formulários, Card do Jogo e Card da Pergunta.

Adicionar loading states e mensagens de sucesso/erro.

(Opcional) Criar uma função para gerar aleatoriamente pegadinhas nos cards (ex: “Perdeu 2 pontos!”, “Ganhou 1 ponto bônus!”).