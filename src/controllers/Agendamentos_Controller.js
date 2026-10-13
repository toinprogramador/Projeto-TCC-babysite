const Agendamentos = require('../models/Agendamentos');
const Baba = require('../models/Baba');

const diasDaSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;
const formatosEntrevista = ['online', 'presencial'];

function perfilComTipo(req, res, tipo) {
    if (req.sessao.perfil.tipo_usuario !== tipo) {
        res.status(403).json({ erro: 'Esta ação não está disponível para o seu perfil.' });
        return false;
    }
    return true;
}

function dataValida(data) {
    if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const dataConvertida = new Date(`${data}T00:00:00.000Z`);
    const partesHoje = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());
    const hoje = Object.fromEntries(partesHoje.map(({ type, value }) => [type, value]));
    const hojeNoBrasil = `${hoje.year}-${hoje.month}-${hoje.day}`;
    return !Number.isNaN(dataConvertida.valueOf())
        && dataConvertida.toISOString().slice(0, 10) === data
        && data >= hojeNoBrasil;
}

function idValido(id) {
    return /^\d+$/.test(id) && Number(id) > 0;
}

function mensagemValida(mensagem) {
    return mensagem === undefined || mensagem === null
        || (typeof mensagem === 'string' && mensagem.trim().length <= 500);
}

function horariosValidos(horarios) {
    if (!Array.isArray(horarios) || horarios.length < 1 || horarios.length > 7) return false;
    const dias = new Set();
    return horarios.every((horario) => {
        if (!horario || !diasDaSemana.includes(horario.dia_semana) || dias.has(horario.dia_semana)) return false;
        dias.add(horario.dia_semana);
        return formatoHora.test(horario.hora_inicio)
            && formatoHora.test(horario.hora_fim)
            && horario.hora_inicio < horario.hora_fim;
    });
}

async function executarComResposta(res, operacao, mensagemErro) {
    try {
        res.json(await operacao());
    } catch (erro) {
        console.error(mensagemErro, erro);
        res.status(500).json({ erro: mensagemErro });
    }
}

const AgendamentosController = {
    listarSolicitacoes: (req, res) => {
        if (!['pais', 'baba'].includes(req.sessao.perfil.tipo_usuario)) {
            return res.status(403).json({ erro: 'Esta ação não está disponível para o seu perfil.' });
        }
        executarComResposta(res, () => Agendamentos.listarSolicitacoes(req.sessao.perfil), 'Não foi possível carregar as solicitações pendentes.');
    },

    listarEntrevistas: (req, res) => {
        if (!['pais', 'baba'].includes(req.sessao.perfil.tipo_usuario)) {
            return res.status(403).json({ erro: 'Esta ação não está disponível para o seu perfil.' });
        }
        executarComResposta(res, () => Agendamentos.listarEntrevistas(req.sessao.perfil), 'Não foi possível carregar as entrevistas.');
    },

    listarContratos: (req, res) => {
        if (!['pais', 'baba'].includes(req.sessao.perfil.tipo_usuario)) {
            return res.status(403).json({ erro: 'Esta ação não está disponível para o seu perfil.' });
        }
        executarComResposta(res, () => Agendamentos.listarContratos(req.sessao.perfil), 'Não foi possível carregar os contratos.');
    },

    solicitarEntrevista: async (req, res) => {
        if (!perfilComTipo(req, res, 'pais')) return;
        const { codigo_baba, data_entrevista, hora_entrevista, formato, mensagem } = req.body || {};
        if (typeof codigo_baba !== 'string' || !codigo_baba.trim()
            || !dataValida(data_entrevista)
            || !formatoHora.test(hora_entrevista || '')
            || !formatosEntrevista.includes(formato)
            || !mensagemValida(mensagem)) {
            return res.status(400).json({ erro: 'Confira a babá, a data, o horário e o formato da entrevista.' });
        }
        try {
            if (!await Agendamentos.babaAtivaExiste(codigo_baba)) {
                return res.status(404).json({ erro: 'Perfil de babá ativa não encontrado.' });
            }
            const solicitacaoId = await Agendamentos.criarSolicitacaoEntrevista({
                codigo_pais: req.sessao.perfil.codigo_perfil,
                codigo_baba,
                data_entrevista,
                hora_entrevista,
                formato,
                mensagem: mensagem?.trim() || null
            });
            res.status(201).json({ solicitacao_id: solicitacaoId, mensagem: 'Solicitação de entrevista enviada.' });
        } catch (erro) {
            console.error('Não foi possível enviar a solicitação de entrevista.', erro);
            res.status(500).json({ erro: 'Não foi possível enviar a solicitação de entrevista.' });
        }
    },

    solicitarContrato: async (req, res) => {
        if (!perfilComTipo(req, res, 'pais')) return;
        const { codigo_baba, data_inicio, horarios, mensagem } = req.body || {};
        if (typeof codigo_baba !== 'string' || !codigo_baba.trim()
            || !dataValida(data_inicio)
            || !horariosValidos(horarios)
            || !mensagemValida(mensagem)) {
            return res.status(400).json({ erro: 'Informe a babá, a data de início e pelo menos um dia com horário válido.' });
        }
        try {
            if (!await Agendamentos.babaAtivaExiste(codigo_baba)) {
                return res.status(404).json({ erro: 'Perfil de babá ativa não encontrado.' });
            }
            const solicitacaoId = await Agendamentos.criarSolicitacaoContrato({
                codigo_pais: req.sessao.perfil.codigo_perfil,
                codigo_baba,
                data_inicio,
                horarios,
                mensagem: mensagem?.trim() || null
            });
            res.status(201).json({ solicitacao_id: solicitacaoId, mensagem: 'Solicitação de contratação enviada.' });
        } catch (erro) {
            console.error('Não foi possível enviar a solicitação de contratação.', erro);
            res.status(500).json({ erro: 'Não foi possível enviar a solicitação de contratação.' });
        }
    },

    aceitarEntrevista: async (req, res) => {
        if (!perfilComTipo(req, res, 'baba')) return;
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Solicitação inválida.' });
        try {
            const entrevistaId = await Agendamentos.aceitarEntrevista(Number(req.params.id), req.sessao.perfil.codigo_perfil);
            if (!entrevistaId) return res.status(404).json({ erro: 'Solicitação não encontrada ou já processada.' });
            res.json({ entrevista_id: entrevistaId, mensagem: 'Entrevista aceita e adicionada à agenda.' });
        } catch (erro) {
            console.error('Não foi possível aceitar a entrevista.', erro);
            res.status(500).json({ erro: 'Não foi possível aceitar a entrevista.' });
        }
    },

    aceitarContrato: async (req, res) => {
        if (!perfilComTipo(req, res, 'baba')) return;
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Solicitação inválida.' });
        try {
            const contratoId = await Agendamentos.aceitarContrato(Number(req.params.id), req.sessao.perfil.codigo_perfil);
            if (!contratoId) return res.status(404).json({ erro: 'Solicitação não encontrada ou já processada.' });
            res.json({ contrato_id: contratoId, mensagem: 'Contratação aceita e adicionada aos contratos.' });
        } catch (erro) {
            console.error('Não foi possível aceitar a contratação.', erro);
            res.status(500).json({ erro: 'Não foi possível aceitar a contratação.' });
        }
    },

    recusarEntrevista: async (req, res) => {
        return AgendamentosController.recusar(req, res, 'entrevista');
    },

    recusarContrato: async (req, res) => {
        return AgendamentosController.recusar(req, res, 'contrato');
    },

    recusar: async (req, res, tipo) => {
        if (!perfilComTipo(req, res, 'baba')) return;
        if (!idValido(req.params.id)) return res.status(400).json({ erro: 'Solicitação inválida.' });
        try {
            const removida = await Agendamentos.recusarSolicitacao(tipo, Number(req.params.id), req.sessao.perfil.codigo_perfil);
            if (!removida) return res.status(404).json({ erro: 'Solicitação não encontrada ou já processada.' });
            res.status(204).end();
        } catch (erro) {
            console.error('Não foi possível recusar a solicitação.', erro);
            res.status(500).json({ erro: 'Não foi possível recusar a solicitação.' });
        }
    },

    buscarPerfilBaba: (req, res) => {
        Baba.buscarPerfilPublico(req.params.codigo, (erro, perfil) => {
            if (erro) return res.status(500).json({ erro: 'Não foi possível carregar o perfil da babá.' });
            if (!perfil) return res.status(404).json({ erro: 'Perfil de babá não encontrado.' });
            res.json(perfil);
        });
    }
};

module.exports = AgendamentosController;
