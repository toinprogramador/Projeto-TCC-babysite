const { randomInt } = require('crypto');
const db = require('../database/connection');

function gerarCodigo(prefixo) {
    return `${prefixo}${randomInt(0, 1000000000).toString().padStart(9, '0')}`;
}

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

const Cadastro = {
    criar: async (dados) => {
        const usuarioCodigo = gerarCodigo('USR');
        const perfilCodigo = gerarCodigo(dados.tipo_usuario === 'baba' ? 'BAB' : 'PAI');

        await executar('BEGIN IMMEDIATE');
        try {
            await executar(
                `INSERT INTO usuario (usuario_codigo, cpf, email_1, telefone, nome)
                 VALUES (?, ?, ?, ?, ?)`,
                [usuarioCodigo, dados.cpf, dados.email, dados.telefone, dados.nome]
            );

            if (dados.tipo_usuario === 'baba') {
                await executar(
                    `INSERT INTO baba (codigo_baba, cpf, email_1, telefone, nome, usuario_codigo)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [perfilCodigo, dados.cpf, dados.email, dados.telefone, dados.nome, usuarioCodigo]
                );
            } else {
                await executar(
                    `INSERT INTO pais (codigo_pais, cpf, email_1, telefone, nome, usuario_codigo)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [perfilCodigo, dados.cpf, dados.email, dados.telefone, dados.nome, usuarioCodigo]
                );
            }

            await executar(
                'INSERT INTO credencial (usuario_codigo, senha_hash) VALUES (?, ?)',
                [usuarioCodigo, dados.senhaHash]
            );
            await executar('COMMIT');
            return { usuarioCodigo, perfilCodigo };
        } catch (erro) {
            await executar('ROLLBACK').catch(() => {});
            throw erro;
        }
    }
};

module.exports = Cadastro;