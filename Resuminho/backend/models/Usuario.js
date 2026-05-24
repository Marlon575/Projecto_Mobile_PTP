const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({

nome:  { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true },

  // A senha nunca é guardada em texto limpo — é sempre encriptada
senha: { type: String, required: true, minlength: 6 },

  // role define o que o utilizador pode fazer
  // estudante → lê e avalia
  // revisor   → publica e aprova
  // admin     → gere tudo
role: {
    type: String,
    enum: ['estudante', 'revisor', 'admin'],
    default: 'estudante',
},

curso:  { type: String, default: '' },
ano:    { type: String, default: '1' },
pontos: { type: Number, default: 0 },
foto:   { type: String, default: '' },

}, { timestamps: true });

// Antes de guardar, encripta a senha se ela foi alterada
UsuarioSchema.pre('save', async function (next) {
if (!this.isModified('senha')) return next();
const sal = await bcrypt.genSalt(10);
this.senha = await bcrypt.hash(this.senha, sal);
next();
});

// Método para comparar a senha no login
UsuarioSchema.methods.compararSenha = async function (senhaTexto) {
return bcrypt.compare(senhaTexto, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);