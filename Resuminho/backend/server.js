const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const ligarBaseDados = require('./config/database');

// Carrega as variáveis do ficheiro .env
dotenv.config();

const app = express();

// Permite que a app mobile fale com este servidor
app.use(cors());

// Faz o Express ler JSON no body dos pedidos POST e PUT
app.use(express.json());

// Serve os ficheiros PDF via URL — ex: /uploads/resumos/ficheiro.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rotas ──────────────────────────────────────────────────────
const authRoutes      = require('./routes/authRoutes');
const resumoRoutes    = require('./routes/resumoRoutes');
const revisaoRoutes   = require('./routes/revisaoRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const perfilRoutes    = require('./routes/perfilRoutes');
const adminRoutes     = require('./routes/adminRoutes');

app.use('/auth',       authRoutes);
app.use('/resumos',    resumoRoutes);
app.use('/revisao',    revisaoRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/perfil',     perfilRoutes);
app.use('/admin',      adminRoutes);

// Rota de teste — confirma que o servidor está vivo
app.get('/', (req, res) => {
res.json({ mensagem: 'Servidor Resuminho está a correr ✅' });
});

// Rota não encontrada
app.use((req, res) => {
res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

// Tratamento de erros
app.use((erro, req, res, next) => {
console.error('Erro no servidor:', erro.message);
res.status(erro.status || 500).json({
    mensagem: erro.message || 'Erro interno do servidor.',
});
});

// ── Arranque ─────
const PORTA = process.env.PORT || 3000;

ligarBaseDados().then(() => {
app.listen(PORTA, () => {
    console.log(`✅ Servidor a correr na porta ${PORTA}`);
});
});