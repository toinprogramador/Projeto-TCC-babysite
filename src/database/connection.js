const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');
const seedersPath = path.resolve(__dirname, 'seeders.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        
        // Ativa chaves estrangeiras
        db.run('PRAGMA foreign_keys = ON;');

        // 1. Executa o Schema (Criação das Tabelas)
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schemaSql, (schemaErr) => {
            if (schemaErr) {
                console.error('Erro ao inicializar schema:', schemaErr.message);
            } else {
                console.log('Tabelas criadas/verificadas com sucesso.');

                // 2. Executa o Seeders (Inserção dos Dados de Teste)
                const seedersSql = fs.readFileSync(seedersPath, 'utf8');
                db.exec(seedersSql, (seedErr) => {
                    if (seedErr) {
                        console.error('Erro ao popular dados iniciais:', seedErr.message);
                    } else {
                        console.log('Dados de teste do seeders.sql inseridos com sucesso!');
                    }
                });
            }
        });
    }
});

module.exports = db;