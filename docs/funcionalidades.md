# Mapa de funcionalidades do Babysite

## Arquitetura de navegação

O sistema será organizado por interfaces próprias. A página `home.html` é a entrada pública. Depois do login ou cadastro, o usuário acessa a área correspondente ao seu perfil:

- **Home**: busca pública de babás, filtros e visualização resumida dos perfis.
- **Home Pais**: espaço do responsável, com as mesmas possibilidades de busca da Home e uma área de relacionamento no estilo WhatsApp Web.
- **Home Babá**: espaço profissional para disponibilidade, tarifa, documentos e entrevistas.
- **Home Admin**: painel de gestão, segurança e moderação da plataforma.

Cada página deve manter a separação de responsabilidades:

- HTML: estrutura e conteúdo da tela.
- CSS: identidade visual, layout responsivo e estados visuais.
- JavaScript: navegação, filtros, formulários, modais e alterações de status.

## Padrão das interfaces autenticadas

As áreas de Pais, Babá e Admin seguem o mesmo modelo de interface:

- **Barra lateral esquerda**: identidade do usuário, navegação pelas funcionalidades e contadores de pendências.
- **Área principal direita**: tela inicial da seção selecionada.
- **Cabeçalho da área de trabalho**: caminho da página, título, notificações e informações da sessão.
- **Estados visuais**: ativo, pendente, aprovado, recusado, banido e vazio.
- **Responsividade**: em telas menores a barra lateral vira menu recolhível.

## Home pública

### Início

- Apresentar a proposta do Babysite.
- Listar babás disponíveis.
- Pesquisar por nome, cidade e experiência.
- Filtrar por estado, tipo de cuidado e tarifa.
- Mostrar avaliação, disponibilidade e situação da verificação.
- Ao tentar abrir detalhes ou agendar sem autenticação, encaminhar para login/cadastro.

## Home Pais

### Início

- Busca por babás disponíveis.
- Filtros por cidade, experiência e disponibilidade.
- Visualização dos perfis mais relevantes.
- Próximas entrevistas e conversas ativas.

### Perfil

- Visualizar dados da babá selecionada.
- Ver apresentação, experiência, avaliação e disponibilidade.
- Acessar informações principais antes de contratar.
- Iniciar contato ou solicitar entrevista.

### Conversas

- Lista de conversas com babás.
- Mensagens no formato de chat.
- Indicador de presença e mensagens não lidas.
- Botão para agendar entrevista.
- Botão para avaliar o atendimento com estrelas e comentário.

### Entrevistas e agendamentos

- Visualizar data, horário, formato e status.
- Cancelar ou solicitar novo horário.
- Receber confirmação da babá.

## Home Babá

### Início

- Resumo de visualizações, nota, tarifa e solicitações novas.
- Alertas para documentos e entrevistas pendentes.

### Meu perfil

- Editar apresentação profissional.
- Definir tarifa por hora.
- Informar experiência e disponibilidade.
- Controlar quais informações aparecem para as famílias.

### Certidão de antecedentes

- Fazer upload de PDF.
- Exibir nome, data de envio, validade e status.
- Estados: aguardando análise, aprovado, recusado e documento expirado.
- Permitir novo envio quando o administrador solicitar.

### Entrevistas

- Visualizar solicitações recebidas.
- Aceitar ou recusar.
- Sugerir outro horário.
- Consultar histórico de entrevistas.

### Conversas

- Responder famílias em uma interface de chat.
- Consultar o contexto da criança antes da entrevista.
- Receber alertas de novas mensagens.

## Home Admin

### Início

- Indicadores de usuários ativos, certidões pendentes, denúncias e índice de segurança.
- Atividades recentes.
- Atalhos para tarefas urgentes.

### Usuários

- Pesquisar usuários.
- Filtrar por babá, responsável, ativo, pendente ou banido.
- Abrir perfil e histórico.
- Moderar cadastro.
- Banir ou reativar conta.

### Certidões

- Listar documentos pendentes.
- Visualizar PDF.
- Aprovar certidão.
- Recusar e solicitar novo documento.
- Registrar data, responsável pela análise e validade.

### Denúncias

- Listar denúncias por prioridade.
- Visualizar envolvidos e contexto da conversa/atendimento.
- Assumir caso.
- Registrar decisão da moderação.
- Encerrar ou reabrir ocorrência.

### Relatórios

- Novos cadastros.
- Entrevistas realizadas.
- Avaliação média.
- Contas banidas e reativadas.
- Certidões analisadas por período.
- Exportação futura em CSV/PDF.

### Configurações

- Ativar ou desativar notificações.
- Definir se novos perfis precisam de aprovação manual.
- Configurar resumo semanal.
- Gerenciar permissões de administradores.

## Próximas integrações

A implementação atual usa dados simulados para demonstrar as interações. Para conectar ao backend, substituir as fontes locais por chamadas de API para autenticação, usuários, mensagens, agendamentos, documentos e denúncias. As funções do JavaScript já devem permanecer separadas da marcação para facilitar essa troca.
