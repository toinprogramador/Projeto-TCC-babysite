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

- Abrir o perfil detalhado da babá selecionada em `perfil_baba`.
- Ver apresentação, experiência, avaliação e disponibilidade, quando informadas.
- Acessar informações principais antes de contratar.
- Conversar com a babá, solicitar entrevista ou propor contratação.

### Entrevistas e contratos

- O responsável envia uma solicitação de entrevista com data, horário e formato.
- A solicitação fica pendente para a babá; quando aceita, é removida das solicitações e cria um compromisso em Entrevistas para os dois perfis. Quando recusada, é removida sem criar entrevista.
- O responsável envia uma solicitação de contratação com data de início e dias/horários de trabalho.
- A solicitação fica pendente para a babá; quando aceita, é removida das solicitações e cria um contrato para os dois perfis. Quando recusada, é removida sem criar contrato.
- Consultar solicitações pendentes, entrevistas aceitas e contratos aceitos nas áreas de Pais e Babá.

### Conversas

- Lista de conversas com babás.
- Enviar e receber mensagens persistidas no banco.
- Atualizar mensagens novas automaticamente enquanto a tela está aberta.
- Indicador de presença e mensagens não lidas.
- Botão para agendar entrevista.
- Botão para avaliar o atendimento com estrelas e comentário.

### Entrevistas e agendamentos

- Visualizar entrevistas aceitas com data, horário, formato e status.
- Cancelar ou solicitar novo horário.
- Receber confirmação da babá.
- Consultar contratos aceitos, com data de início e horários semanais.

## Home Babá

### Início

- Resumo de visualizações, nota, tarifa e solicitações novas.
- Alertas para documentos e entrevistas pendentes.

### Meu perfil

- Editar apresentação profissional.
- Definir tarifa por hora.
- Informar experiência e disponibilidade.
- Cadastrar e alterar dias e horários habituais de trabalho. A disponibilidade é uma relação de horários por dia da semana associada à babá; não representa solicitação nem contrato.
- Controlar quais informações aparecem para as famílias.

### Certidão de antecedentes

- Fazer upload de PDF.
- Exibir nome, data de envio, validade e status.
- Estados: aguardando análise, aprovado, recusado e documento expirado.
- Permitir novo envio quando o administrador solicitar.

### Entrevistas

- Receber solicitações de entrevista com data, horário e formato.
- Aceitar para criar o registro permanente na agenda de entrevistas ou recusar para remover a solicitação sem criar compromisso.
- Consultar entrevistas aceitas.

### Contratos

- Receber solicitações com data de início e dias/horários semanais propostos pelo responsável.
- Aceitar para criar o contrato permanente ou recusar para remover a solicitação sem criar contrato.
- Consultar contratos aceitos e seus horários.

### Conversas

- Responder famílias em uma interface de chat com mensagens persistidas.
- Atualizar mensagens novas automaticamente enquanto a tela está aberta.
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

A disponibilidade semanal, solicitações de entrevista e contratação, registros aceitos e conversas/mensagens estão conectados à API e ao banco de dados. Documentos, avaliações, relatórios e denúncias ainda precisam de integração completa; as funções do JavaScript devem permanecer separadas da marcação para facilitar essa evolução.
