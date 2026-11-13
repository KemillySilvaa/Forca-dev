-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeJogador" TEXT NOT NULL,
    "palavraId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'em_andamento',
    "tentativasRestantes" INTEGER NOT NULL DEFAULT 6,
    "letrasTentadas" TEXT NOT NULL DEFAULT '',
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "dificuldade" TEXT NOT NULL DEFAULT 'medio',
    "dicaUsada" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadaEm" DATETIME,
    CONSTRAINT "Partida_palavraId_fkey" FOREIGN KEY ("palavraId") REFERENCES "Palavra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Partida" ("criadaEm", "finalizadaEm", "id", "letrasTentadas", "nomeJogador", "palavraId", "status", "tentativasRestantes") SELECT "criadaEm", "finalizadaEm", "id", "letrasTentadas", "nomeJogador", "palavraId", "status", "tentativasRestantes" FROM "Partida";
DROP TABLE "Partida";
ALTER TABLE "new_Partida" RENAME TO "Partida";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
