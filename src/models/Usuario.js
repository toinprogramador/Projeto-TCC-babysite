const db = require('../database/connection');

const Usuario = {
    // Buscar todos os usuários
    buscarTodos: (callback) => {
        const sql = 'SELECT * FROM usuario';
        db.all(sql, [], callback);
    },

    // Buscar usuário por código (12 dígitos)
    buscarPorCodigo: (usuario_codigo, callback) => {
        const sql = 'SELECT * FROM usuario WHERE usuario_codigo = ?';
        db.get(sql, [usuario_codigo], callback);
    },

    // Criar novo usuário
    criar: (dados, callback) => {
        const { usuario_codigo, cpf, email_1, email_2, telefone, nome } = dados;
        const sql = `INSERT INTO usuario (usuario_codigo, cpf, email_1, email_2, telefone, nome) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [usuario_codigo, cpf, email_1, email_2, telefone, nome], callback);
    }
};

module.exports = Usuario;