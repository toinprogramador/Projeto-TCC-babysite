const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/Usuario_Controller');
const responsaveisController = require('../controllers/Responsaveis_Controller');
const babaController = require('../controllers/Baba_Controller');
const cadastroController = require('../controllers/Cadastro_Controller');
const sessaoController = require('../controllers/Sessao_Controller');
const Sessoes = require('../middleware/Sessoes');

// Rotas de Usuários Gerais
router.post('/cadastros', cadastroController.cadastrar);
router.post('/sessao', sessaoController.entrar);
router.get('/sessao', Sessoes.exigirAutenticacao, sessaoController.perfilAtual);
router.delete('/sessao', Sessoes.exigirAutenticacao, sessaoController.sair);
router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:codigo', usuarioController.buscarPorCodigo);
router.post('/usuarios', usuarioController.cadastrar);

// Rotas de Responsáveis (Pais)
router.get('/responsaveis', responsaveisController.listar);
router.post('/responsaveis', responsaveisController.cadastrar);

// Rotas de Babás (Apenas ativas no site público)
router.get('/babas', babaController.listarAtivas);
router.get('/babas/:codigo/disponibilidade', babaController.buscarDisponibilidade);
router.put('/babas/:codigo/disponibilidade', babaController.salvarDisponibilidade);

module.exports = router;