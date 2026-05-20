const niveis = [
  {
    id: 1,
    nome: 'Caloiro',
    pontoMinimo: 0,
    pontoMaximo: 50,
    cor: '#9E9E9E',
    icone: '🎒',
    descricao: 'Estás a começar a tua jornada no Resuminho!',
  },
  {
    id: 2,
    nome: 'Estudante',
    pontoMinimo: 51,
    pontoMaximo: 150,
    cor: '#2196F3',
    icone: '📚',
    descricao: 'Já tens alguma experiência na plataforma.',
  },
  {
    id: 3,
    nome: 'Colaborador',
    pontoMinimo: 151,
    pontoMaximo: 300,
    cor: '#4CAF50',
    icone: '✏️',
    descricao: 'Contribuis regularmente para a comunidade.',
  },
  {
    id: 4,
    nome: 'Destaque da Turma',
    pontoMinimo: 301,
    pontoMaximo: 600,
    cor: '#FF9800',
    icone: '⭐',
    descricao: 'És um dos melhores da turma!',
  },
  {
    id: 5,
    nome: 'Embaixador',
    pontoMinimo: 601,
    pontoMaximo: 1000,
    cor: '#9C27B0',
    icone: '🏆',
    descricao: 'Representas o melhor do Resuminho.',
  },
  {
    id: 6,
    nome: 'Mentor',
    pontoMinimo: 1001,
    pontoMaximo: Infinity,
    cor: '#F44336',
    icone: '👑',
    descricao: 'És uma lenda da UJAC!',
  },
];

// Pontos por acção
const pontosAccao = {
  estrela1: 1,
  estrela2: 3,
  estrela3: 5,
  estrela4: 8,
  estrela5: 12,
  download: 2,
  aprovacao: 10,
};

// Função que retorna o nível actual com base nos pontos
const obterNivel = (pontos) => {
  return niveis.find(n => pontos >= n.pontoMinimo && pontos <= n.pontoMaximo)
    || niveis[niveis.length - 1];
};

// Função que calcula a percentagem de progresso dentro do nível actual
const calcularProgresso = (pontos) => {
  const nivel = obterNivel(pontos);
  if (nivel.pontoMaximo === Infinity) return 100;
  const intervalo = nivel.pontoMaximo - nivel.pontoMinimo;
  const progresso = pontos - nivel.pontoMinimo;
  return Math.round((progresso / intervalo) * 100);
};

module.exports = { niveis, pontosAccao, obterNivel, calcularProgresso };