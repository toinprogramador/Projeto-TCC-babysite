CREATE TABLE IF NOT EXISTS usuario (
    usuario_codigo CHAR(12) PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    email_1 VARCHAR(300) NOT NULL,
    email_2 VARCHAR(300),
    telefone VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS pais (
    codigo_pais CHAR(12) PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    email_1 VARCHAR(300) NOT NULL,
    email_2 VARCHAR(300),
    telefone VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    usuario_codigo CHAR(12) NOT NULL,
    FOREIGN KEY (usuario_codigo) REFERENCES usuario (usuario_codigo)
);

CREATE TABLE IF NOT EXISTS baba (
    codigo_baba CHAR(12) PRIMARY KEY,
    cpf CHAR(11) NOT NULL,
    email_1 VARCHAR(300) NOT NULL,
    email_2 VARCHAR(300),
    telefone VARCHAR(20) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    usuario_codigo CHAR(12) NOT NULL,
    status_cadastro VARCHAR(20) DEFAULT 'Ativa',
    foto TEXT,
    FOREIGN KEY (usuario_codigo) REFERENCES usuario (usuario_codigo)
);

CREATE TABLE IF NOT EXISTS credencial (
    usuario_codigo CHAR(12) PRIMARY KEY,
    senha_hash TEXT NOT NULL,
    FOREIGN KEY (usuario_codigo) REFERENCES usuario (usuario_codigo)
);

CREATE TABLE IF NOT EXISTS baba_disponibilidade (
    codigo_baba CHAR(12) NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    hora_inicio CHAR(5) NOT NULL,
    hora_fim CHAR(5) NOT NULL,
    PRIMARY KEY (codigo_baba, dia_semana),
    FOREIGN KEY (codigo_baba) REFERENCES baba (codigo_baba) ON DELETE CASCADE
);

-- Índices de Unicidade
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuario_cpf ON usuario (cpf);
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuario_email_1 ON usuario (email_1);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pais_cpf ON pais (cpf);
CREATE UNIQUE INDEX IF NOT EXISTS idx_baba_cpf ON baba (cpf);