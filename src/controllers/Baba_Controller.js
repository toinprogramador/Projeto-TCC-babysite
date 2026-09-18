const Baba = require('../models/Baba');

const babaController = {
    // GET /api/babas
    listarAtivas: (req, res) => {
        Baba.listarAtivas((err, rows) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao buscar listagem de babás.' });
            }
            res.json(rows);
        });
    }
};

module.exports = babaController;