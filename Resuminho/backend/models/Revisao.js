const mongoose = require('mongoose');

const RevisaoSchema = new mongoose.Schema({

  // Qual resumo está a ser revisto
resumo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resumo',
    required: true,
},

  // Qual revisor tomou a decisão
revisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
},

  // A decisão tomada — aprovado ou rejeitado
decisao: {
    type: String,
    enum: ['aprovado', 'rejeitado'],
    required: true,
},

  // Comentário obrigatório quando rejeita, opcional quando aprova
comentario: { type: String, default: '' },

}, { timestamps: true });

// Um revisor só pode rever o mesmo resumo uma vez
// Esta regra evita que o mesmo revisor aprove duas vezes
RevisaoSchema.index({ resumo: 1, revisor: 1 }, { unique: true });

module.exports = mongoose.model('Revisao', RevisaoSchema);