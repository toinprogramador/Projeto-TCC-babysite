const db = require('../database/connection');

function executar(sql, valores = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, valores, function (erro) {
            if (erro) {
                reject(erro);
                return;
            }
            resolve(this);
        });
    });
}

function consultar(sql, valores = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, valores, (erro, rows) => erro ? reject(erro) : resolve(rows));
    });
}

const Baba = {
    // Listar todas as babás ativas para o site público
    listarAtivas: (callback) => {
        const sql = `SELECT b.codigo_baba, u.nome, b.foto, b.status_cadastro
                     FROM baba AS b 
                     INNER JOIN usuario AS u ON b.usuario_codigo = u.usuario_codigo 
                     WHERE b.status_cadastro = 'Ativa' 
                     ORDER BY u.nome ASC`;
        db.all(sql, [], callback);
    },

    buscarPorCodigo: (codigo_baba, callback) => {
        db.get('SELECT codigo_baba FROM baba WHERE codigo_baba = ?', [codigo_baba], callback);
    },

    listarDisponibilidade: (codigo_baba) => consultar(
        `SELECT dia_semana, hora_inicio, hora_fim
         FROM baba_disponibilidade
         WHERE codigo_baba = ?
         ORDER BY CASE dia_semana
             WHEN 'segunda' THEN 1 WHEN 'terca' THEN 2 WHEN 'quarta' THEN 3
             WHEN 'quinta' THEN 4 WHEN 'sexta' THEN 5 WHEN 'sabado' THEN 6
             WHEN 'domingo' THEN 7 END`,
        [codigo_baba]
    ),

    salvarDisponibilidade: async (codigo_baba, disponibilidade) => {
        await executar('BEGIN IMMEDIATE');
        try {
            await executar('DELETE FROM baba_disponibilidade WHERE codigo_baba = ?', [codigo_baba]);
            for (const horario of disponibilidade) {
                await executar(
                    `INSERT INTO baba_disponibilidade (codigo_baba, dia_semana, hora_inicio, hora_fim)
                     VALUES (?, ?, ?, ?)`,
                    [codigo_baba, horario.dia_semana, horario.hora_inicio, horario.hora_fim]
                );
            }
            await executar('COMMIT');
        } catch (erro) {
            await executar('ROLLBACK').catch(() => {});
            throw erro;
        }
    },

    // Atualizar status da babá (usado pelo Módulo Admin)
    atualizarStatus: (codigo_baba, novoStatus, callback) => {
        const sql = 'UPDATE baba SET status_cadastro = ? WHERE codigo_baba = ?';
        db.run(sql, [novoStatus, codigo_baba], callback);
    }
};

module.exports = Baba;