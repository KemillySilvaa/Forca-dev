
/** Situações possíveis de uma partida. */
export type StatusPartida = "em_andamento" | "vitoria" | "derrota";

/** Representa os dados necessários para aplicar as regras do jogo. */
export interface PartidaJogo {
  palavra: string;
  letrasTentadas: string[];
  vidasRestantes: number;
  status: StatusPartida;
  pontos: number;
}
