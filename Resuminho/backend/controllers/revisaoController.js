const Revisao = require('../models/Revisao');
const Resumo  = require('../models/Resumo');
const Usuario = require('../models/Usuario');

// ── LISTAR RESUMOS PENDENTES ───────
// GET /revisao/pendentes — só revisores
const listarPendentes = async (req, res) => {
try {
    // Busca resumos pendentes que este revisor ainda não reviu
    const jaRevistos = await Revisao.find({
    revisor: req.utilizador._id,
    }).distinct('resumo');

    // Exclui os que já foram revistos por este revisor
    const resumos = await Resumo.find({
    estado: 'pendente',
    _id: { $nin: jaRevistos },
      // Um revisor não pode rever os seus próprios resumos
    autor: { $ne: req.utilizador._id },
    }).populate('autor', 'nome curso');

    res.json(resumos);
} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

// ── DECIDIR SOBRE UM RESUMO ───────────────────────────────────
// POST /revisao/:id/decidir — só revisores
const decidir = async (req, res) => {
try {
    const { decisao, comentario } = req.body;
    const resumoId = req.params.id;

    // Valida a decisão
    if (!['aprovado', 'rejeitado'].includes(decisao)) {
    return res.status(400).json({ mensagem: 'Decisão inválida.' });
    }

    // Verifica se o resumo existe
    const resumo = await Resumo.findById(resumoId);
    if (!resumo) {
    return res.status(404).json({ mensagem: 'Resumo não encontrado.' });
    }

    // Um revisor não pode rever o seu próprio resumo
    if (resumo.autor.toString() === req.utilizador._id.toString()) {
    return res.status(403).json({
        mensagem: 'Não podes rever o teu próprio resumo.',
    });
    }

    // Verifica se este revisor já reviu este resumo
    const jaReviu = await Revisao.findOne({
    resumo: resumoId,
    revisor: req.utilizador._id,
    });
    if (jaReviu) {
    return res.status(400).json({
        mensagem: 'Já revisaste este resumo.',
    });
    }

    // Guarda a decisão deste revisor
    await Revisao.create({
    resumo:    resumoId,
    revisor:   req.utilizador._id,
    decisao,
    comentario: comentario || '',
    });

    if (decisao === 'aprovado') {
      // Incrementa o contador de aprovações
    resumo.aprovacoes += 1;

      // Precisa de 2 aprovações para ficar aprovado
    if (resumo.aprovacoes >= 2) {
        resumo.estado = 'aprovado';

        // Dá 10 pontos bónus ao autor pela aprovação
        await Usuario.findByIdAndUpdate(resumo.autor, {
        $inc: { pontos: 10 },
        });
    }

    await resumo.save();

    } else {
      // Rejeição imediata — basta um revisor rejeitar
    resumo.estado = 'rejeitado';
    await resumo.save();
    }

    res.json({
    mensagem: `Resumo ${decisao} com sucesso.`,
    estado: resumo.estado,
    });

} catch (erro) {
    res.status(500).json({ mensagem: erro.message });
}
};

module.exports = { listarPendentes, decidir };