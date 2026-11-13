-- CreateTable
CREATE TABLE "Categoria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Palavra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "termo" TEXT NOT NULL,
    "dica" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    CONSTRAINT "Palavra_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeJogador" TEXT NOT NULL,
    "palavraId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "tentativasRestantes" INTEGER NOT NULL DEFAULT 6,
    "letrasTentadas" TEXT NOT NULL DEFAULT '',
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadaEm" DATETIME,
    CONSTRAINT "Partida_palavraId_fkey" FOREIGN KEY ("palavraId") REFERENCES "Palavra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Palpite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "letra" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "partidaId" INTEGER NOT NULL,
    CONSTRAINT "Palpite_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Palavra_termo_key" ON "Palavra"("termo");

-- CreateIndex
CREATE UNIQUE INDEX "Palpite_partidaId_letra_key" ON "Palpite"("partidaId", "letra");
