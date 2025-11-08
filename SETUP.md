# Chute Certo - Guia de Configuração

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuito)

## Passo 1: Instalação de Dependências

```bash
npm install
```

## Passo 2: Configurar Supabase

### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se ainda não tiver)
4. Clique em "New project"
5. Preencha:
   - Nome do projeto
   - Database Password (anote essa senha!)
   - Região (escolha mais próxima)
6. Aguarde a criação do projeto (~2 minutos)

### 2.2 Obter Credenciais

1. No dashboard do seu projeto, vá em **Settings** (engrenagem no menu lateral)
2. Clique em **API**
3. Copie as seguintes informações:
   - **Project URL** (exemplo: https://xxxxx.supabase.co)
   - **anon public** key

### 2.3 Configurar Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql` deste projeto
4. Cole no editor SQL
5. Clique em **Run** para executar
6. Você verá a mensagem "Success. No rows returned"

### 2.4 Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Email Auth**, você pode configurar:
   - Desabilitar "Confirm email" para desenvolvimento (opcional)
   - Isso permite criar contas sem precisar confirmar email

## Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

2. Abra `.env.local` e preencha com as credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## Passo 4: Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
npm run build
npm start
```

## Passo 5: Criar Primeira Conta

1. Acesse http://localhost:3000
2. Você será redirecionado para `/login`
3. Clique em "Cadastre-se"
4. Preencha email e senha
5. Faça login

## Fluxo de Uso da Aplicação

1. **Dashboard**: Visualize todos os seus jogos
2. **Criar Jogo**: Clique em "Novo Jogo" para criar
3. **Adicionar Perguntas**: Após criar, você será redirecionado para adicionar perguntas
4. **Jogar**: Quando tiver perguntas cadastradas, clique em "Jogar"

## Estrutura de Jogo

- Cada jogo pode ter múltiplas perguntas
- Cada pergunta tem 2-6 respostas (apenas 1 correta)
- 20% dos cards são "pegadinhas" (ganham/perdem pontos extras)
- Dois times jogam alternadamente
- Ganha o time com mais pontos ao final

## Solução de Problemas

### Erro de conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Certifique-se de que o arquivo `.env.local` está na raiz do projeto
- Reinicie o servidor de desenvolvimento

### Erro ao criar conta

- Verifique se executou o SQL schema corretamente
- Confira se a autenticação por email está habilitada no Supabase

### Tabelas não encontradas

- Execute novamente o arquivo `supabase-schema.sql` no SQL Editor

## Deploy (Opcional)

### Vercel

1. Faça push do código para GitHub
2. Importe no Vercel
3. Adicione as variáveis de ambiente
4. Deploy!

## Suporte

Para problemas ou dúvidas, verifique:
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.com/docs)
