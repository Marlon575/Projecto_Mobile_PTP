// Formata uma data para português 

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const diasSemana = [
  'Domingo', 'Segunda-feira', 'Terça-feira',
  'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado',
];

// Ex: "20 de Maio de 2026"
const formatarDataCompleta = (data) => {
  const d = new Date(data);
  if (isNaN(d)) return 'Data inválida';
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
};

// Ex: "20/05/2026"
const formatarDataCurta = (data) => {
  const d = new Date(data);
  if (isNaN(d)) return '--/--/----';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
};

// Ex: "há 2 dias", "há 1 hora", "agora"
const formatarDataRelativa = (data) => {
  const d = new Date(data);
  if (isNaN(d)) return '';
  const agora = new Date();
  const diff = Math.floor((agora - d) / 1000); // diferença em segundos

  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 2592000) return `há ${Math.floor(diff / 86400)} dias`;
  if (diff < 31536000) return `há ${Math.floor(diff / 2592000)} meses`;
  return `há ${Math.floor(diff / 31536000)} anos`;
};

// Ex: "Segunda-feira, 20 de Maio"
const formatarDataDiaSemana = (data) => {
  const d = new Date(data);
  if (isNaN(d)) return '';
  return `${diasSemana[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
};

export {
  formatarDataCompleta,
  formatarDataCurta,
  formatarDataRelativa,
  formatarDataDiaSemana,
};