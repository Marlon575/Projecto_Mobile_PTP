const mongoose = require('mongoose');

const resumoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
  },
  ficheiro: {
    type: String,
    required: true,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  disciplina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: true,
  },
  estado: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente',
  },
  revisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  comentario: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Resumo', resumoSchema);