const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const ligarBD = require('./model/config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const adminRoutes = require('./model/routes/adminRoutes');
app.use('/admin', adminRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Resuminho a funcionar!' });
});

const PORT = process.env.PORT || 3000;

ligarBD().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
  });
});