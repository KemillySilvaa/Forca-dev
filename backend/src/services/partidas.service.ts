
import {
  buscarPalavraAleatoria,
  type Dificuldade,
} from "../repositories/palavras.repository";

import {
  criarPartida,
  buscarPartidaPorId,
  atualizarPartida,
  registrarPalpiteEAtualizarPartida,
} from "../repositories/partidas.repository";

import {
  aplicarPalpite,
  gerarMascara,
} from "../game/regras";

import type { PartidaJogo, StatusPartida } from "../types";

// Inicia uma nova partida com a dificuldade escolhida.
export async function iniciarPartida(
  nomeJogador: string,
  dificuldade: Dificuldade = "medio"
) {
  // Seleciona uma palavra aleatória conforme a dificuldade.
  const palavra = await buscarPalavraAleatoria(dificuldade);

  if (!palavra) {
    throw new Error("Não existem palavras cadastradas para essa dificuldade.");
  }

  // Cria a partida no banco de dados.
  const novaPartida = await criarPartida({
    nomeJogador,
    palavraId: palavra.id,
    dificuldade,
  });

  // Retorna o estado inicial da partida.
  return consultarPartida(novaPartida.id);
}

// Consulta uma partida e prepara os dados que serão enviados ao frontend.
export async function consultarPartida(id: number) {
  const partida = await buscarPartidaPorId(id);

  if (!partida) {
    throw new Error("Partida não encontrada.");
  }

  const letrasTentadas = partida.letrasTentadas
    ? partida.letrasTentadas.split("")
    : [];

  const palavra = partida.palavra.termo;

  // Monta a resposta sem revelar a palavra durante a partida.
  return {
    id: partida.id,
    jogador: partida.nomeJogador,
    categoria: partida.palavra.categoria.nome,
    mascara: gerarMascara(palavra, letrasTentadas),
    letrasTentadas,
    vidasRestantes: partida.tentativasRestantes,
    status: partida.status,
    pontos: partida.pontos,
    palavra:
      partida.status === "em_andamento" ? null : palavra,
  };
}

// Processa um palpite e atualiza o estado da partida.
export async function enviarPalpite(id: number, letra: string) {
  const partida = await buscarPartidaPorId(id);

  if (!partida) {
    throw new Error("Partida não encontrada.");
  }

  const estadoAtual: PartidaJogo = {
    palavra: partida.palavra.termo,
    letrasTentadas: partida.letrasTentadas
      ? partida.letrasTentadas.split("")
      : [],
    vidasRestantes: partida.tentativasRestantes,
    status: partida.status as StatusPartida,
    pontos: partida.pontos,
  };

  // Aplica as regras antes de gravar qualquer alteração.
  const novoEstado = aplicarPalpite(estadoAtual, letra);

  const letraNormalizada = letra.toUpperCase();

  // Prepara os dados que serão atualizados no banco.
  const dadosAtualizacao = {
    letrasTentadas: novoEstado.letrasTentadas.join(""),
    tentativasRestantes: novoEstado.vidasRestantes,
    status: novoEstado.status,
    pontos: novoEstado.pontos,
    finalizadaEm:
      novoEstado.status === "em_andamento" ? null : new Date(),
  };

  // Registra o palpite e atualiza a partida atomicamente.
  await registrarPalpiteEAtualizarPartida(
    id,
    letraNormalizada,
    partida.palavra.termo.includes(letraNormalizada),
    dadosAtualizacao
  );

  // Retorna o estado atualizado.
  return consultarPartida(id);
}

// Utiliza a dica paga, descontando uma vida do jogador.
export async function usarDica(id: number) {
  const partida = await buscarPartidaPorId(id);

  // Verifica se a partida existe.
  if (!partida) {
    throw new Error("Partida não encontrada.");
  }

  // Impede utilizar dicas em partidas encerradas.
  if (partida.status !== "em_andamento") {
    throw new Error("Esta partida já foi encerrada.");
  }

  // Impede utilizar mais de uma dica por partida.
  if (partida.dicaUsada) {
    throw new Error("A dica já foi utilizada nesta partida.");
  }

  // Protege contra estados inválidos com zero ou menos vidas.
  if (partida.tentativasRestantes <= 0) {
    throw new Error("Não há vidas restantes para utilizar a dica.");
  }

  // Desconta uma vida pelo uso da dica.
  const novasVidas = partida.tentativasRestantes - 1;

  // Verifica se o jogador perdeu todas as vidas.
  const novoStatus: StatusPartida =
    novasVidas === 0 ? "derrota" : "em_andamento";

  // Atualiza os dados da partida no banco.
  await atualizarPartida(id, {
    tentativasRestantes: novasVidas,
    dicaUsada: true,
    status: novoStatus,
    pontos: 0,
    finalizadaEm:
      novoStatus === "derrota" ? new Date() : null,
  });

  // Consulta o estado atualizado.
  const estadoAtualizado = await consultarPartida(id);

  // Retorna a dica sem revelar a palavra secreta.
  return {
    ...estadoAtualizado,
    dica: partida.palavra.dica,
  };
}
