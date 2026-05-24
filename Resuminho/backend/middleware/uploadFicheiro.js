const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Garante que a pasta de uploads existe — cria se não existir
const pastaUploads = path.join(__dirname, '..', 'uploads', 'resumos');
if (!fs.existsSync(pastaUploads)) {
fs.mkdirSync(pastaUploads, { recursive: true });
}

// Define onde e com que nome guardar o ficheiro
const armazenamento = multer.diskStorage({

destination: (req, file, cb) => {
    // cb(erro, pasta) — null significa sem erro
    cb(null, pastaUploads);
},

filename: (req, file, cb) => {
    // Nome único: timestamp + número aleatório + extensão original
    // Evita que dois ficheiros com o mesmo nome se sobreponham
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extensao  = path.extname(file.originalname);
    cb(null, `${nomeUnico}${extensao}`);
},
});

// Filtro — só aceita ficheiros PDF
const filtro = (req, file, cb) => {
if (file.mimetype === 'application/pdf') {
    cb(null, true);
} else {
    cb(new Error('Apenas ficheiros PDF são permitidos.'), false);
}
};

// Tamanho máximo de 10MB por ficheiro
const upload = multer({
storage: armazenamento,
fileFilter: filtro,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;