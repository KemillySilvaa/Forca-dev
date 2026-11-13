
import type { PartidaJogo } from "../types";

// Define a quantidade inicial de vidas de cada partida.
export const VIDAS_INICIAIS = 6;

/**
 * Gera a máscara da palavra, mostrando apenas as letras já descobertas.
 * @param palavra Palavra secreta da partida.
 * @param tentadas Letras que o jogador já tentou.
 * @returns Palavra parcialmente revelada.
 */
export function gerarMascara(
  palavra: string,
  tentadas: string[]
): string {
  // Percorre cada letra da palavra.
  return [...palavra]
    .map((letra) =>
      // Mostra a letra se ela já foi tentada; caso contrário, mostra "_".
      tentadas.includes(letra) ? letra : "_"
    )
    // Junta as letras em uma única string.
    .join("");
}

/**
 * Calcula os pontos de uma vitória conforme a regra RN06.
 * @param palavra Palavra descoberta pelo jogador.
 * @param vidasRestantes Quantidade de vidas que sobraram.
 * @returns Pontuação final da partida.
 */
export function calcularPontos(
  palavra: string,
  vidasRestantes: number
): number {
  // Conta quantas letras diferentes existem na palavra.
  const letrasDistintas = new Set(palavra).size;

  // Cada vida vale 10 pontos e cada letra distinta vale 5.
  return vidasRestantes * 10 + letrasDistintas * 5;
}

/**
 * Aplica um palpite sem modificar a partida original.
 * @param partida Estado atual da partida.
 * @param letra Letra escolhida pelo jogador.
 * @returns Novo estado da partida após o palpite.
 */
export function aplicarPalpite(
  partida: PartidaJogo,
  letra: string
): PartidaJogo {
  // Converte a letra para maiúscula.
  const letraNormalizada = letra.toUpperCase();

  // Verifica se foi enviada exatamente uma letra de A a Z.
  if (!/^[A-Z]$/.test(letraNormalizada)) {
    throw new Error("Envie apenas uma letra de A a Z.");
  }

  // Impede palpites em partidas já encerradas.
  if (partida.status !== "em_andamento") {
    throw new Error("Esta partida já foi encerrada.");
  }

  // Impede que o jogador tente a mesma letra novamente.
  if (partida.letrasTentadas.includes(letraNormalizada)) {
    throw new Error("Esta letra já foi tentada.");
  }

  // Cria uma nova lista sem alterar a partida original.
  const novasLetras = [
    ...partida.letrasTentadas,
    letraNormalizada,
  ];

  // Verifica se a letra escolhida existe na palavra.
  const acertou = partida.palavra.includes(letraNormalizada);

  // Se errou, desconta uma vida. Se acertou, mantém as vidas.
  const novasVidas = acertou
    ? partida.vidasRestantes
    : partida.vidasRestantes - 1;

  // Verifica se todas as letras da palavra foram descobertas.
  const venceu = [...partida.palavra].every((letraAtual) =>
    novasLetras.includes(letraAtual)
  );

  // Verifica se as vidas acabaram.
  const perdeu = novasVidas === 0;

  // Determina o resultado da partida.
  const novoStatus = venceu
    ? "vitoria"
    : perdeu
      ? "derrota"
      : "em_andamento";

  // Calcula pontos somente quando o jogador vence.
  const novosPontos =
    novoStatus === "vitoria"
      ? calcularPontos(partida.palavra, novasVidas)
      : 0;

  // Retorna uma nova partida com os dados atualizados.
  return {
    ...partida,
    letrasTentadas: novasLetras,
    vidasRestantes: novasVidas,
    status: novoStatus,
    pontos: novosPontos,
  };
}
