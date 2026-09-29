const Baba = require('../models/Baba');

const diasDaSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

const babaController = {
    // GET /api/babas
    listarAtivas: (req, res) => {
        Baba.listarAtivas((err, rows) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao buscar listagem de babás.' });
            }
            res.json(rows);
        });
    },

    buscarDisponibilidade: (req, res) => {
        Baba.buscarPorCodigo(req.params.codigo, async (erro, baba) => {
            if (erro) return res.status(500).json({ erro: 'Erro ao buscar perfil da babá.' });
            if (!baba) return res.status(404).json({ erro: 'Perfil de babá não encontrado.' });
            try {
                res.json(await Baba.listarDisponibilidade(req.params.codigo));
            } catch (erroConsulta) {
                res.status(500).json({ erro: 'Erro ao buscar disponibilidade.' });
            }
        });
    },

    salvarDisponibilidade: (req, res) => {
        const disponibilidade = req.body?.disponibilidade;
        if (!Array.isArray(disponibilidade) || disponibilidade.length > 7) {
            return res.status(400).json({ erro: 'Informe os dias e horários de disponibilidade.' });
        }

        const diasInformados = new Set();
        const horariosValidos = disponibilidade.every((horario) => {
            if (!horario || !diasDaSemana.includes(horario.dia_semana) || diasInformados.has(horario.dia_semana)) {
                return false;
            }
            diasInformados.add(horario.dia_semana);
            return formatoHora.test(horario.hora_inicio)
                && formatoHora.test(horario.hora_fim)
                && horario.hora_inicio < horario.hora_fim;
        });
        if (!horariosValidos) {
            return res.status(400).json({ erro: 'Confira os dias e horários informados.' });
        }

        Baba.buscarPorCodigo(req.params.codigo, async (erro, baba) => {
            if (erro) return res.status(500).json({ erro: 'Erro ao buscar perfil da babá.' });
            if (!baba) return res.status(404).json({ erro: 'Perfil de babá não encontrado.' });
            try {
                await Baba.salvarDisponibilidade(req.params.codigo, disponibilidade);
                res.json({ mensagem: 'Disponibilidade atualizada com sucesso.' });
            } catch (erroAtualizacao) {
                res.status(500).json({ erro: 'Não foi possível salvar a disponibilidade.' });
            }
        });
    }
};

module.exports = babaController;