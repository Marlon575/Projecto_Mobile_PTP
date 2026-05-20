const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  descricao: {
    type: String,
    trim: true,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Curso', cursoSchema);