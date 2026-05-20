const mongoose = require ('mongoose');

const ligarBD = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB ligado com sucesso');
    } catch (erro) {
        console.error('Erro ao ligar ao MongoDB:', erro.message);
    process.exit(1);
    }
};

module.exports = ligarBD;