const db = require('../database/connection');

const Baba = {
    // Listar todas as babás ativas para o site público
    listarAtivas: (callback) => {
        const sql = `SELECT b.codigo_baba, u.nome, b.telefone, b.email_1, b.foto, b.status_cadastro 
                     FROM baba AS b 
                     INNER JOIN usuario AS u ON b.usuario_codigo = u.usuario_codigo 
                     WHERE b.status_cadastro = 'Ativa' 
                     ORDER BY u.nome ASC`;
        db.all(sql, [], callback);
    },

    // Atualizar status da babá (usado pelo Módulo Admin)
    atualizarStatus: (codigo_baba, novoStatus, callback) => {
        const sql = 'UPDATE baba SET status_cadastro = ? WHERE codigo_baba = ?';
        db.run(sql, [novoStatus, codigo_baba], callback);
    }
};

module.exports = Baba;