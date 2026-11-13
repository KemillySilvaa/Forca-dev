
import prisma from "../database/db";

// Dados necessários para criar uma nova partida.
interface DadosNovaPartida {
  nomeJogador: string;
  palavraId: number;
  dificuldade: string;
}

// Campos que podem ser atualizados durante uma partida.
export interface DadosAtualizacaoPartida {
  status?: string;
  tentativasRestantes?: number;
  letrasTentadas?: string;
  pontos?: number;
  dicaUsada?: boolean;
  finalizadaEm?: Date | null;
}

// Cria uma nova partida no banco de dados.
export async function criarPartida(dados: DadosNovaPartida) {
  return prisma.partida.create({
    data: {
      nomeJogador: dados.nomeJogador,
      palavraId: dados.palavraId,
      dificuldade: dados.dificuldade,
    },
  });
}

// Busca uma partida pelo seu identificador.
// Também carrega a palavra, a categoria e os palpites registrados.
export async function buscarPartidaPorId(id: number) {
  return prisma.partida.findUnique({
    where: { id },
    include: {
      palavra: {
        include: {
          categoria: true,
        },
      },
      palpites: true,
    },
  });
}

// Atualiza os dados de uma partida existente.
export async function atualizarPartida(
  id: number,
  dados: DadosAtualizacaoPartida
) {
  return prisma.partida.update({
    where: { id },
    data: dados,
  });
}

// Registra uma letra escolhida pelo jogador.
export async function registrarPalpite(
  partidaId: number,
  letra: string,
  correta: boolean
) {
  return prisma.palpite.create({
    data: {
      partidaId,
      letra,
      correta,
    },
  });
}

// Busca as dez melhores partidas vencidas.
// Em caso de empate, prioriza quem terminou primeiro.
export async function buscarRanking() {
  return prisma.partida.findMany({
    where: {
      status: "vitoria",
    },
    orderBy: [
      { pontos: "desc" },
      { finalizadaEm: "asc" },
    ],
    take: 10,
    include: {
      palavra: true,
    },
  });
}

// Registra o palpite e atualiza a partida em uma única transação.
export async function registrarPalpiteEAtualizarPartida(
  partidaId: number,
  letra: string,
  correta: boolean,
  dadosAtualizacao: DadosAtualizacaoPartida
) {
  // Executa as duas operações juntas.
  // Se alguma falhar, o banco desfaz ambas.
  return prisma.$transaction([
    prisma.palpite.create({
      data: {
        partidaId,
        letra,
        correta,
      },
    }),

    prisma.partida.update({
      where: { id: partidaId },
      data: dadosAtualizacao,
    }),
  ]);
}
