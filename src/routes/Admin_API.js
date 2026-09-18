const express = require('express');
const router = express.Router();

const adminController = require('../controllers/Admin_Controller');
const usuarioController = require('../controllers/Usuario_Controller');

// Consultar todos os usuários cadastrados no sistema
router.get('/usuarios', usuarioController.listar);

// Alterar o status de cadastro de uma babá (Ativa, Pendente, Bloqueada)
router.put('/babas/:codigo/status', adminController.alterarStatusBaba);

module.exports = router;