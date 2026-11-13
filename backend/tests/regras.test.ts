
import { describe, it, expect } from "vitest";

import {
  gerarMascara,
  calcularPontos,
  aplicarPalpite,
  VIDAS_INICIAIS,
} from "../src/game/regras";

import type { PartidaJogo } from "../src/types";

// Cria uma partida padrão para reutilizar nos testes.
function criarPartida(): PartidaJogo {
  return {
    palavra: "PROMISE",
    letrasTentadas: [],
    vidasRestantes: VIDAS_INICIAIS,
    status: "em_andamento",
    pontos: 0,
  };
}

describe("Regras do jogo", () => {
  it("deve esconder as letras ainda não descobertas", () => {
    expect(gerarMascara("PROMISE", ["P", "E"])).toBe("P_____E");
  });

  it("deve calcular a pontuação corretamente", () => {
    expect(calcularPontos("PROMISE", 4)).toBe(75);
  });

  it("deve manter as vidas quando o jogador acerta", () => {
    const resultado = aplicarPalpite(criarPartida(), "p");
    expect(resultado.vidasRestantes).toBe(6);
    expect(resultado.letrasTentadas).toContain("P");
  });

  it("deve descontar uma vida quando o jogador erra", () => {
    const resultado = aplicarPalpite(criarPartida(), "A");
    expect(resultado.vidasRestantes).toBe(5);
  });

  it("deve encerrar a partida quando o jogador descobre a palavra", () => {
    let partida = criarPartida();

    for (const letra of "PROMISE") {
      partida = aplicarPalpite(partida, letra);
    }

    expect(partida.status).toBe("vitoria");
    expect(partida.pontos).toBe(95);
  });

  it("deve encerrar a partida quando as vidas acabam", () => {
    let partida = criarPartida();

    for (const letra of ["A", "B", "C", "D", "F", "G"]) {
      partida = aplicarPalpite(partida, letra);
    }

    expect(partida.vidasRestantes).toBe(0);
    expect(partida.status).toBe("derrota");
    expect(partida.pontos).toBe(0);
  });

  it("não deve permitir repetir uma letra", () => {
    const partida = aplicarPalpite(criarPartida(), "P");

    expect(() => aplicarPalpite(partida, "P")).toThrow(
      "Esta letra já foi tentada."
    );
  });

  it("não deve permitir palpites inválidos", () => {
    expect(() => aplicarPalpite(criarPartida(), "AB")).toThrow(
      "Envie apenas uma letra de A a Z."
    );
  });

  it("não deve alterar a partida original", () => {
    const partidaOriginal = criarPartida();

    aplicarPalpite(partidaOriginal, "A");

    expect(partidaOriginal.vidasRestantes).toBe(6);
    expect(partidaOriginal.letrasTentadas).toEqual([]);
  });
});

