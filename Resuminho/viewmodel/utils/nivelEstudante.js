const niveis = [
{ nome: 'Caloiro', min: 0, max: 50, cor: '#9E9E9E', icone: '🎒' },
{ nome: 'Estudante', min: 51, max: 150, cor: '#2196F3', icone: '📚' },
{ nome: 'Colaborador', min: 151, max: 300, cor: '#4CAF50', icone: '✏️' },
{ nome: 'Destaque da Turma', min: 301, max: 600, cor: '#FF9800', icone: '⭐' },
{ nome: 'Embaixador', min: 601, max: 1000, cor: '#9C27B0', icone: '🏆' },
{ nome: 'Mentor', min: 1001, max: Infinity, cor: '#F44336', icone: '👑' },
];

const obterNivel = (pontos) => {
return niveis.find(n => pontos >= n.min && pontos <= n.max) || niveis[0];
};

const calcularProgresso = (pontos) => {
const nivel = obterNivel(pontos);
if (nivel.max === Infinity) return 100;
const intervalo = nivel.max - nivel.min;
const progresso = pontos - nivel.min;
  return Math.round((progresso / intervalo) * 100);
};

const obterProximoNivel = (pontos) => {
const indexActual = niveis.findIndex(
    n => pontos >= n.min && pontos <= n.max
);
return niveis[indexActual + 1] || null;
};

export { niveis, obterNivel, calcularProgresso, obterProximoNivel };