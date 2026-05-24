const Resumo  = require('../models/Resumo');
const Usuario = require('../models/Usuario');

// ── LISTAR RESUMOS APROVADOS ────
// GET /resumos
const listarResumos = async (req, res) => {
try {
    // Só mostra resumos aprovados aos estudantes
    // Aceita filtros por disciplina e curso na query
    // Exemplo: GET /resumos?disciplina=Matematica&curso=Informatica
    const filtro = { estado: 'aprovado' };
    if (req.query.disciplina) filtro.disciplina = req.query.disciplina;
    if (req.query.curso)      filtro.curso      = req.query.curso;

    const resumos = await Resumo.find(filtro)
    .populate('autor', 'nome curso')
    .sort({ createdAt: -1 });

    res.json(resumos);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── OBTER UM RESUMO ───────
// GET /resumos/:id
const obterResumo = async (req, res) => {
try {
    const resumo = await Resumo.findById(req.params.id)
    .populate('autor', 'nome curso');

    if (!resumo) {
    return res.status(404).json({ mensagem: 'Resumo não encontrado.' });
    }

    res.json(resumo);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── PUBLICAR RESUMO ──────
// POST /resumos — só revisores
const publicarResumo = async (req, res) => {
try {
    const { titulo, disciplina, curso, ano, descricao } = req.body;

    // req.file é preenchido pelo middleware uploadFicheiro
    if (!req.file) {
    return res.status(400).json({ mensagem: 'Ficheiro PDF obrigatório.' });
    }

    const resumo = await Resumo.create({
    titulo,
    disciplina,
    curso,
    ano,
    descricao,
      // Caminho relativo do ficheiro guardado pelo Multer
    ficheiroPDF: req.file.filename,
      // req.utilizador é preenchido pelo middleware autenticar
    autor: req.utilizador._id,
    });

    res.status(201).json(resumo);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── REGISTAR DOWNLOAD ───────
// PUT /resumos/:id/download
const registarDownload = async (req, res) => {
try {
    const resumo = await Resumo.findById(req.params.id);

    if (!resumo) {
    return res.status(404).json({ mensagem: 'Resumo não encontrado.' });
    }

    // Incrementa o contador de downloads
    resumo.downloads += 1;
    await resumo.save();

    // Dá 2 pontos ao autor por cada download
    await Usuario.findByIdAndUpdate(resumo.autor, {
    $inc: { pontos: 2 },
    });

    res.json({ mensagem: 'Download registado.', downloads: resumo.downloads });
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── MEUS RESUMOS ───────
// GET /resumos/meus — resumos do revisor autenticado
const meusResumos = async (req, res) => {
try {
    const resumos = await Resumo.find({ autor: req.utilizador._id })
    .sort({ createdAt: -1 });

    res.json(resumos);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

module.exports = {
listarResumos,
obterResumo,
publicarResumo,
registarDownload,
meusResumos,
};