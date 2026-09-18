-- ==========================================
-- SEEDERS: Dados de Teste (12 dígitos por código)
-- ==========================================

-- 1. Inserção de Usuários Base (USR + 9 dígitos)
INSERT OR IGNORE INTO usuario (usuario_codigo, cpf, email_1, email_2, telefone, nome) VALUES
('USR102938475', '12345678901', 'ana.silva@gmail.com', 'ana.pessoal@gmail.com', '(11) 98888-0001', 'Ana Silva'),
('USR203948576', '23456789012', 'bruno.souza@gmail.com', NULL, '(21) 98888-0002', 'Bruno Souza'),
('USR908172635', '98765432109', 'baba.maria@gmail.com', NULL, '(11) 91234-5678', 'Maria Auxiliadora'),
('USR807162534', '87654321098', 'baba.josefa@gmail.com', NULL, '(21) 92345-6789', 'Josefa Souza'),
('USR000000001', '00000000000', 'admin@babysite.com', NULL, '(83) 99999-0000', 'Administrador do Sistema');

-- 2. Inserção dos Responsáveis / Pais (PAI + 9 dígitos)
INSERT OR IGNORE INTO pais (codigo_pais, cpf, email_1, email_2, telefone, nome, usuario_codigo) VALUES
('PAI102938475', '12345678901', 'ana.silva@gmail.com', 'ana.pessoal@gmail.com', '(11) 98888-0001', 'Ana Silva', 'USR102938475'),
('PAI203948576', '23456789012', 'bruno.souza@gmail.com', NULL, '(21) 98888-0002', 'Bruno Souza', 'USR203948576');

-- 3. Inserção das Babás (BAB + 9 dígitos)
INSERT OR IGNORE INTO baba (codigo_baba, cpf, email_1, email_2, telefone, nome, usuario_codigo, status_cadastro, foto) VALUES
('BAB908172635', '98765432109', 'baba.maria@gmail.com', NULL, '(11) 91234-5678', 'Maria Auxiliadora', 'USR908172635', 'Ativa', 'maria_perfil.jpg'),
('BAB807162534', '87654321098', 'baba.josefa@gmail.com', NULL, '(21) 92345-6789', 'Josefa Souza', 'USR807162534', 'Pendente', 'josefa_perfil.jpg');