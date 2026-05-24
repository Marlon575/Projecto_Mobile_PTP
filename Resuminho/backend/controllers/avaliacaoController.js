const Avaliacao = require('../models/Avaliacao');
const Resumo    = require('../models/Resumo');
const Usuario   = require('../models/Usuario');

// Tabela de pontos por estrelas
// 1=1pt, 2=3pt, 3=5pt, 4=8pt, 5=12pt
const PONTOS_POR_ESTRELAS = { 1: 1, 2: 3, 3: 5, 4: 8, 5: 12 };

// ── AVALIAR RESUMO ──────────
// POST /avaliacoes
const avaliar = async (req, res) => {
try {
    const { resumoId, estrelas, comentario } = req.body;

    // Valida o número de estrelas
    if (!estrelas || estrelas < 1 || estrelas > 5) {
    return res.status(400).json({ mensagem: 'Estrelas deve ser entre 1 e 5.' });
    }

    // Verifica se o resumo existe e está aprovado
    const resumo = await Resumo.findById(resumoId);
    if (!resumo) {
    return res.status(404).json({ mensagem: 'Resumo não encontrado.' });
    }
    if (resumo.estado !== 'aprovado') {
    return res.status(400).json({ mensagem: 'Só podes avaliar resumos aprovados.' });
    }

    // Um utilizador não pode avaliar o seu próprio resumo
    if (resumo.autor.toString() === req.utilizador._id.toString()) {
    return res.status(403).json({ mensagem: 'Não podes avaliar o teu próprio resumo.' });
    }

    // Verifica se já avaliou este resumo
    const jaAvaliou = await Avaliacao.findOne({
    resumo:    resumoId,
    avaliador: req.utilizador._id,
    });
    if (jaAvaliou) {
    return res.status(400).json({ mensagem: 'Já avaliaste este resumo.' });
    }

    // Guarda a avaliação
    await Avaliacao.create({
    resumo:     resumoId,
    avaliador:  req.utilizador._id,
    estrelas,
    comentario: comentario || '',
    });

    // Actualiza a média de avaliações do resumo
    const totalAnterior = resumo.totalAvaliacoes;
    const mediaAnterior = resumo.mediaAvaliacoes;
    resumo.totalAvaliacoes += 1;
    resumo.mediaAvaliacoes =
      (mediaAnterior * totalAnterior + estrelas) / resumo.totalAvaliacoes;
    await resumo.save();

    // Dá pontos ao autor do resumo com base nas estrelas
    const pontos = PONTOS_POR_ESTRELAS[estrelas] || 0;
    await Usuario.findByIdAndUpdate(resumo.autor, {
    $inc: { pontos },
    });

    res.status(201).json({
    mensagem: 'Avaliação registada com sucesso.',
    pontos,
    });

} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── LISTAR AVALIAÇÕES DE UM RESUMO ─────────
// GET /avaliacoes/:resumoId
const listarAvaliacoes = async (req, res) => {
try {
    const avaliacoes = await Avaliacao.find({ resumo: req.params.resumoId })
    .populate('avaliador', 'nome')
    .sort({ createdAt: -1 });

    res.json(avaliacoes);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

module.exports = { avaliar, listarAvaliacoes };