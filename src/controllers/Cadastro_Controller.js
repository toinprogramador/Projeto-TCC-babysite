const { randomBytes, scrypt } = require('crypto');
const { promisify } = require('util');
const Cadastro = require('../models/Cadastro');

const derivarSenha = promisify(scrypt);

function normalizarTexto(valor) {
    return typeof valor === 'string' ? valor.trim() : '';
}

const cadastroController = {
    cadastrar: async (req, res) => {
        const dados = req.body || {};
        const nome = normalizarTexto(dados.nome);
        const cpf = normalizarTexto(dados.cpf).replace(/\D/g, '');
        const email = normalizarTexto(dados.email).toLowerCase();
        const telefone = normalizarTexto(dados.telefone);
        const senha = typeof dados.senha === 'string' ? dados.senha : '';
        const tipoUsuario = dados.tipo_usuario;

        if (!['pais', 'baba'].includes(tipoUsuario)
            || !nome || nome.length > 100
            || cpf.length !== 11
            || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 300
            || !telefone || telefone.length > 20
            || senha.length < 8) {
            return res.status(400).json({ erro: 'Confira os dados obrigatórios do cadastro.' });
        }

        try {
            const sal = randomBytes(16).toString('hex');
            const hash = (await derivarSenha(senha, sal, 64)).toString('hex');
            const { usuarioCodigo, perfilCodigo } = await Cadastro.criar({
                tipo_usuario: tipoUsuario,
                nome,
                cpf,
                email,
                telefone,
                senhaHash: `${sal}:${hash}`
            });

            return res.status(201).json({
                mensagem: 'Cadastro realizado com sucesso.',
                usuario_codigo: usuarioCodigo,
                codigo_perfil: perfilCodigo
            });
        } catch (erro) {
            if (erro.code === 'SQLITE_CONSTRAINT') {
                return res.status(409).json({ erro: 'Já existe um cadastro com este CPF ou e-mail.' });
            }
            console.error('Erro ao cadastrar usuário:', erro.message);
            return res.status(500).json({ erro: 'Não foi possível concluir o cadastro.' });
        }
    }
};

module.exports = cadastroController;