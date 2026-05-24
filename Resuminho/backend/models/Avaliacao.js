const mongoose = require('mongoose');

const AvaliacaoSchema = new mongoose.Schema({

  // Qual resumo está a ser avaliado
resumo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumo',
    required: true,
},

  // Quem avaliou
avaliador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
},

  // Número de estrelas de 1 a 5
  // 1 estrela = 1pt, 2 = 3pt, 3 = 5pt, 4 = 8pt, 5 = 12pt
estrelas: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
},

  // Comentário opcional junto com as estrelas
comentario: { type: String, default: '' },

}, { timestamps: true });

// Um utilizador só pode avaliar o mesmo resumo uma vez
AvaliacaoSchema.index({ resumo: 1, avaliador: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);