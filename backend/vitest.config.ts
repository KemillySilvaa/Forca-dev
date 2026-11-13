
import { defineConfig } from "vitest/config";

// Configura o Vitest para executar os testes do backend.
export default defineConfig({
  test: {
    // Define a pasta onde os testes serão encontrados.
    include: ["tests/**/*.test.ts"],
  },
});
