# Documento de Requisitos — ApiHub

## Objetivo do Sistema

O ApiHub tem como objetivo oferecer uma plataforma web para apicultores gerenciarem seus apiários, colmeias e inspeções apícolas. O sistema centraliza o registro e acompanhamento de informações essenciais para o manejo correto das colônias de abelhas, contribuindo com a saúde da produção apícola.

---

## Requisitos Funcionais Implementados

| ID | Requisito |
|----|-----------|
| RF01 | O sistema deve permitir que o usuário crie uma conta com nome de usuário e senha |
| RF02 | O sistema deve autenticar o usuário e retornar um token JWT para sessões futuras |
| RF03 | O sistema deve exibir apenas os dados do usuário autenticado |
| RF04 | O usuário deve poder cadastrar apiários informando nome, cidade, coordenadas geográficas, número de registro e registro territorial |
| RF05 | O usuário deve poder visualizar a lista paginada de seus apiários |
| RF06 | O usuário deve poder excluir um apiário |
| RF07 | O usuário deve poder cadastrar colmeias vinculadas a um apiário, informando nome, tipo de quadro, origem da colônia, quantidade de caixas e dados da rainha |
| RF08 | O usuário deve poder visualizar a lista paginada de colmeias de um apiário |
| RF09 | O usuário deve poder excluir uma colmeia |
| RF10 | O usuário deve poder registrar inspeções de uma colmeia, informando data, padrão de cria, força da colônia, presença da rainha, ovos, células reais e observações |
| RF11 | O usuário deve poder visualizar a lista paginada de inspeções de uma colmeia |
| RF12 | O usuário deve poder excluir uma inspeção |
| RF13 | O sistema deve redirecionar o usuário para a tela de login ao acessar rotas protegidas sem autenticação |

---

## Requisitos Não Funcionais Considerados

| ID | Requisito |
|----|-----------|
| RNF01 | **Segurança**: a autenticação utiliza JWT armazenado no localStorage; todas as requisições autenticadas enviam o token no cabeçalho `Authorization: Bearer` |
| RNF02 | **Usabilidade**: a interface é responsiva e adaptada para diferentes tamanhos de tela usando Tailwind CSS |
| RNF03 | **Desempenho**: listagens são paginadas para evitar carregamento excessivo de dados |
| RNF04 | **Manutenibilidade**: o código frontend é organizado em camadas (pages, components, services, context), facilitando a manutenção e extensão |
| RNF05 | **Compatibilidade**: a aplicação funciona nos navegadores modernos (Chrome, Firefox, Edge) |
| RNF06 | **Idioma**: toda a interface está em português brasileiro |
