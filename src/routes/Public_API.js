const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/Usuario_Controller');
const responsaveisController = require('../controllers/Responsaveis_Controller');
const babaController = require('../controllers/Baba_Controller');

// Rotas de Usuários Gerais
router.get('/usuarios', usuarioController.listar);
router.get('/usuarios/:codigo', usuarioController.buscarPorCodigo);
router.post('/usuarios', usuarioController.cadastrar);

// Rotas de Responsáveis (Pais)
router.get('/responsaveis', responsaveisController.listar);
router.post('/responsaveis', responsaveisController.cadastrar);

// Rotas de Babás (Apenas ativas no site público)
router.get('/babas', babaController.listarAtivas);

module.exports = router;