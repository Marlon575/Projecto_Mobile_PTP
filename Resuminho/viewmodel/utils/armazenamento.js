import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves usadas no AsyncStorage
const CHAVES = {
TOKEN: '@resuminho_token',
UTILIZADOR: '@resuminho_utilizador',
};

// Guarda o token JWT após login
const guardarToken = async (token) => {
try {
    await AsyncStorage.setItem(CHAVES.TOKEN, token);
} catch (erro) {
    console.error('Erro ao guardar token:', erro);
}
};

// Lê o token guardado
const obterToken = async () => {
try {
    return await AsyncStorage.getItem(CHAVES.TOKEN);
} catch (erro) {
    console.error('Erro ao obter token:', erro);
    return null;
}
};

// Remove o token (logout)
const removerToken = async () => {
try {
    await AsyncStorage.removeItem(CHAVES.TOKEN);
} catch (erro) {
    console.error('Erro ao remover token:', erro);
}
};

// Guarda os dados do utilizador
const guardarUtilizador = async (utilizador) => {
try {
    await AsyncStorage.setItem(
    CHAVES.UTILIZADOR,
    JSON.stringify(utilizador)
    );
} catch (erro) {
    console.error('Erro ao guardar utilizador:', erro);
}
};

// Lê os dados do utilizador
const obterUtilizador = async () => {
try {
    const dados = await AsyncStorage.getItem(CHAVES.UTILIZADOR);
    return dados ? JSON.parse(dados) : null;
} catch (erro) {
    console.error('Erro ao obter utilizador:', erro);
    return null;
}
};

// Remove os dados do utilizador (logout)
const removerUtilizador = async () => {
try {
    await AsyncStorage.removeItem(CHAVES.UTILIZADOR);
} catch (erro) {
    console.error('Erro ao remover utilizador:', erro);
}
};

// Limpa tudo (logout completo)
const limparTudo = async () => {
try {
    await AsyncStorage.multiRemove([CHAVES.TOKEN, CHAVES.UTILIZADOR]);
} catch (erro) {
    console.error('Erro ao limpar armazenamento:', erro);
}
};

export {
guardarToken,
obterToken,
removerToken,
guardarUtilizador,
obterUtilizador,
removerUtilizador,
limparTudo,
};