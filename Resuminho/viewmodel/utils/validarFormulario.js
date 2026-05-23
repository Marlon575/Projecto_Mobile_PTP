// Valida email
const validarEmail = (email) => {
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email) return 'Email é obrigatório.';
if (!regex.test(email)) return 'Email inválido.';
return null;
};

// Valida password
const validarPassword = (password) => {
if (!password) return 'Password é obrigatória.';
if (password.length < 6) return 'Password deve ter pelo menos 6 caracteres.';
return null;
};

// Valida nome
const validarNome = (nome) => {
if (!nome) return 'Nome é obrigatório.';
if (nome.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres.';
return null;
};

// Valida confirmação de password
const validarConfirmarPassword = (password, confirmar) => {
if (!confirmar) return 'Confirmação de password é obrigatória.';
if (password !== confirmar) return 'As passwords não coincidem.';
return null;
};

// Valida formulário de login completo
const validarLogin = (email, password) => {
const erros = {};
const erroEmail = validarEmail(email);
const erroPassword = validarPassword(password);
if (erroEmail) erros.email = erroEmail;
if (erroPassword) erros.password = erroPassword;
return erros;
};

// Valida formulário de registo completo
const validarRegisto = (nome, email, password, confirmar) => {
const erros = {};
const erroNome = validarNome(nome);
const erroEmail = validarEmail(email);
const erroPassword = validarPassword(password);
const erroConfirmar = validarConfirmarPassword(password, confirmar);
if (erroNome) erros.nome = erroNome;
if (erroEmail) erros.email = erroEmail;
if (erroPassword) erros.password = erroPassword;
if (erroConfirmar) erros.confirmar = erroConfirmar;
return erros;
};

export {
validarEmail,
validarPassword,
validarNome,
validarConfirmarPassword,
validarLogin,
validarRegisto,
};