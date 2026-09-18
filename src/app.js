const express = require('express');
const path = require('path');
const publicRoutes = require('./routes/publicApi');

const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

// Servir arquivos estáticos do Front-end Público (caso existam na pasta public)
app.use(express.static(path.join(__dirname, '../public')));

// Registro das rotas da API pública
app.use('/api', publicRoutes);

module.exports = app;