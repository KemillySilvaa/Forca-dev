
# Diário de Bordo — Forca Dev

## 12/11/2026 — Etapa 1: Preparação do projeto

### Objetivo
Organizar o ambiente de desenvolvimento e preparar o repositório do projeto Forca Dev.

### Atividades realizadas
- Criei a pasta principal do projeto.
- Organizei as pastas `backend`, `frontend` e `docs`.
- Criei o arquivo `.gitignore` para evitar o envio de arquivos desnecessários.
- Criei o `README.md` com a apresentação inicial e as tecnologias previstas.
- Inicializei o repositório Git.
- Conectei o projeto ao GitHub.
- Realizei o primeiro commit e enviei os arquivos para o repositório remoto.

### Resultado
Concluí a preparação inicial do ambiente e deixei a estrutura organizada para iniciar o desenvolvimento da aplicação.

### Etapa — Cadastro inicial de palavras

#### Atividades realizadas
- Criei o arquivo `src/database/seed.ts`.
- Cadastrei 21 palavras divididas em três categorias: Linguagens, Desenvolvimento Web e Conceitos de Programação.
- Adicionei uma dica para cada palavra, preparando o banco para o bônus de dica paga.
- Configurei o comando `npm run seed`.
- Ajustei o carregamento das variáveis de ambiente para permitir a execução do script.

#### Resultado
Executei o seed com sucesso e confirmei o cadastro inicial das palavras e categorias no banco SQLite.

### Etapa — Implementação e testes das regras do jogo

#### Atividades realizadas
- Instalei e configurei o Vitest para executar os testes automatizados.
- Criei o arquivo `tests/regras.test.ts`.
- Implementei 9 testes para verificar a máscara, pontuação, acertos, erros, vitória, derrota, palpites repetidos, entradas inválidas e preservação do estado original.
- Corrigi a expectativa da máscara da palavra PROMISE após identificar uma divergência na quantidade de letras escondidas.

#### Resultado
Executei `npm test` e confirmei que os 9 testes das regras do jogo passaram.


### Etapa — Atualização do modelo de partidas

#### Atividades realizadas
- Atualizei o modelo `Partida` no arquivo `prisma/schema.prisma`.
- Adicionei os campos de pontuação, dificuldade e controle de uso da dica.
- Padronizei o status inicial da partida como `em_andamento`.
- Criei e apliquei a migração `adicionar_recursos_partida`.
- Atualizei o Prisma Client e verifiquei a compilação do TypeScript.

#### Resultado
Atualizei a estrutura do banco SQLite com os campos necessários para as funcionalidades principais e os bônus do jogo. A migração foi concluída e a verificação do TypeScript não apresentou erros.

### Etapa — Implementação dos repositórios

#### Atividades realizadas
- Criei o arquivo `src/repositories/palavras.repository.ts`, responsável por selecionar palavras aleatórias conforme a dificuldade.
- Implementei o filtro de palavras por quantidade de letras para os três níveis de dificuldade.
- Criei o arquivo `src/repositories/partidas.repository.ts`, responsável por criar, consultar e atualizar partidas.
- Implementei o registro de palpites e a consulta das dez melhores partidas no ranking.
- Executei `npx tsc --noEmit` e confirmei que os arquivos compilam sem erros.

#### Resultado
Concluí a camada de repositórios, preparando o acesso ao banco de dados para ser utilizado pela camada de serviços.

### Etapa — Implementação do serviço de partidas

#### Atividades realizadas
- Criei `src/services/partidas.service.ts`.
- Implementei a criação e consulta de partidas.
- Integrei as regras do jogo aos repositórios.
- Implementei o processamento de palpites e atualização da pontuação.
- Implementei a funcionalidade de dica paga, com desconto de uma vida e limite de um uso por partida.
- Revisei os imports e removi código não utilizado.
- Executei os testes automatizados e confirmei que os nove testes das regras passaram.

#### Resultado
Concluí a primeira versão da camada de serviços, conectando as regras do jogo ao banco de dados por meio dos repositórios.

