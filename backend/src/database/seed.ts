
import prisma from "./db";

// Organiza as palavras em categorias, cada uma com sua dica.
const dadosIniciais = [
  {
    nome: "Linguagens",
    palavras: [
      { termo: "JAVASCRIPT", dica: "Linguagem muito utilizada no desenvolvimento web." },
      { termo: "TYPESCRIPT", dica: "Adiciona tipagem estática ao JavaScript." },
      { termo: "PYTHON", dica: "Linguagem conhecida por sua sintaxe simples." },
      { termo: "JAVA", dica: "Linguagem muito utilizada em aplicações corporativas." },
      { termo: "KOTLIN", dica: "Linguagem utilizada no desenvolvimento Android." },
      { termo: "RUBY", dica: "Linguagem associada ao framework Rails." },
      { termo: "SWIFT", dica: "Linguagem utilizada no desenvolvimento para Apple." },
    ],
  },
  {
    nome: "Desenvolvimento Web",
    palavras: [
      { termo: "HTML", dica: "Linguagem de marcação que estrutura páginas web." },
      { termo: "CSS", dica: "Tecnologia responsável pela aparência das páginas." },
      { termo: "REACT", dica: "Biblioteca JavaScript utilizada para criar interfaces." },
      { termo: "ANGULAR", dica: "Framework desenvolvido pelo Google." },
      { termo: "VUE", dica: "Framework progressivo para interfaces." },
      { termo: "FASTIFY", dica: "Framework Node.js utilizado para criar APIs." },
      { termo: "NODEJS", dica: "Ambiente que executa JavaScript fora do navegador." },
    ],
  },
  {
    nome: "Conceitos de Programação",
    palavras: [
      { termo: "ALGORITMO", dica: "Sequência de instruções para resolver um problema." },
      { termo: "VARIAVEL", dica: "Espaço utilizado para armazenar um valor." },
      { termo: "FUNCAO", dica: "Bloco de código criado para executar uma tarefa." },
      { termo: "ARRAY", dica: "Estrutura que armazena uma coleção de elementos." },
      { termo: "OBJETO", dica: "Estrutura que organiza dados em propriedades." },
      { termo: "PROMISE", dica: "Representa o resultado futuro de uma operação assíncrona." },
      { termo: "CALLBACK", dica: "Função passada como argumento para outra função." },
    ],
  },
];

// Cadastra as categorias e suas palavras no banco.
async function main() {
  for (const categoriaDados of dadosIniciais) {
    // Cria a categoria ou reutiliza a existente.
    const categoria = await prisma.categoria.upsert({
      where: { nome: categoriaDados.nome },
      update: {},
      create: { nome: categoriaDados.nome },
    });

    // Cadastra cada palavra vinculada à sua categoria.
    for (const palavraDados of categoriaDados.palavras) {
      await prisma.palavra.upsert({
        where: { termo: palavraDados.termo },
        update: {
          dica: palavraDados.dica,
          categoriaId: categoria.id,
        },
        create: {
          ...palavraDados,
          categoriaId: categoria.id,
        },
      });
    }
  }

  console.log("Seed concluído! 21 palavras cadastradas em 3 categorias.");
}

// Executa o cadastro e encerra a conexão com o banco.
main()
  .catch((erro: unknown) => {
    console.error("Erro ao executar o seed:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
