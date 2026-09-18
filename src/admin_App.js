const express = require('express');
const path = require('path');
const adminRoutes = require('./routes/adminApi');

const adminApp = express();

// Middleware para processar JSON
adminApp.use(express.json());

// Servir arquivos estáticos do Front-end do Admin (caso existam na pasta public/admin)
adminApp.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// Registro das rotas da API Admin
adminApp.use('/admin/api', adminRoutes);

module.exports = adminApp;