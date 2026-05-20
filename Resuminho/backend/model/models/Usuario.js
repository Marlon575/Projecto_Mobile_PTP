const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  papel: {
    type: String,
    enum: ['estudante', 'revisor', 'admin'],
    default: 'estudante',
  },
  bloqueado: {
    type: Boolean,
    default: false,
  },
  anoNomeacao: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);