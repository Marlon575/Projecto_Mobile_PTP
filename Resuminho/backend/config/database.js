const mongoose = require('mongoose');

const ligarBaseDados = async () => {
try {
    // Lê o MONGO_URI do ficheiro .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Ligado ao MongoDB Atlas');
} catch (erro) {
    // Se falhar, mostra o erro e para tudo
    // Não faz sentido correr o servidor sem base de dados
    console.error('❌ Erro ao ligar ao MongoDB:', erro.message);
    process.exit(1);
}
};

module.exports = ligarBaseDados;