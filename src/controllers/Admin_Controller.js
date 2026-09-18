const Baba = require('../models/Baba');

const adminController = {
    // PUT /admin/api/babas/:codigo/status
    alterarStatusBaba: (req, res) => {
        const { codigo } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ erro: 'O novo status deve ser fornecido.' });
        }

        Baba.atualizarStatus(codigo, status, function(err) {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao atualizar status da babá.' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ mensagem: 'Babá não encontrada.' });
            }
            res.json({ mensagem: `Status da babá atualizado para '${status}' com sucesso!` });
        });
    }
};

module.exports = adminController;