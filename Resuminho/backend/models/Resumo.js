const mongoose = require('mongoose');

const ResumoSchema = new mongoose.Schema({

titulo:     { type: String, required: true, trim: true },
disciplina: { type: String, required: true },
curso:      { type: String, required: true },
ano:        { type: String, required: true },
descricao:  { type: String, default: '' },

  // Caminho do ficheiro PDF guardado no servidor
ficheiroPDF: { type: String, required: true },

  // estado controla o fluxo de revisão
  // pendente  → aguarda aprovação de 2 revisores
  // aprovado  → visível para os estudantes
  // rejeitado → não visível, tem comentário
estado: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
},

  // Quem publicou — referência ao modelo Usuario
autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
},

downloads:       { type: Number, default: 0 },
mediaAvaliacoes: { type: Number, default: 0 },
totalAvaliacoes: { type: Number, default: 0 },

  // Número de aprovações recebidas — precisa de 2 para ficar aprovado
aprovacoes: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Resumo', ResumoSchema);