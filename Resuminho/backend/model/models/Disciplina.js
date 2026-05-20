const mongoose = require('mongoose');

const disciplinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true,
  },
  ano: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
}, { timestamps: true });

module.exports = mongoose.model('Disciplina', disciplinaSchema);