# ApiHub — Sistema de Gerenciamento de Apiários

## Integrantes

| Nome | Função |
|------|--------|
| Maurilio Thomaz Coloda | Frontend e integração com a API |
| Davi Samuel Schneider | Backend (API REST com Spring Boot) |
| [Integrante 3] | Documentação e testes |

## Descrição do Sistema

O **ApiHub** é um sistema web para gerenciamento de apiários (apicultura). Ele permite que apicultores cadastrem e acompanhem seus apiários, colmeias e registrem inspeções periódicas de cada colmeia, facilitando o controle da saúde das colônias de abelhas.

## Tecnologias Utilizadas

### Frontend
- **React** — biblioteca para construção da interface
- **JavaScript (ES6+)** — linguagem principal
- **Vite** — ferramenta de build e servidor de desenvolvimento
- **Tailwind CSS** — estilização por classes utilitárias
- **React Router DOM** — roteamento entre páginas

### Backend
- **Java** com **Spring Boot**
- **JWT** para autenticação
- API REST documentada via OpenAPI (Swagger)

## Instruções para Execução

### Pré-requisitos
- Node.js 18+ instalado
- Backend rodando em `http://localhost:8080`

### Passos

```bash
# Entrar na pasta do código fonte
cd codigo-fonte

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

### Fluxo de uso

1. Acesse a aplicação e crie uma conta em `/register`
2. Faça login em `/login`
3. Cadastre um apiário na tela inicial
4. Clique no apiário para ver e gerenciar as colmeias
5. Clique em uma colmeia para registrar e visualizar inspeções

## Funcionalidades Implementadas

- **Autenticação**: cadastro de usuário e login com JWT
- **Apiários**: listar, cadastrar e excluir apiários
- **Colmeias**: listar, cadastrar e excluir colmeias de um apiário (inclui dados da rainha)
- **Inspeções**: listar, cadastrar e excluir inspeções de uma colmeia
- **Paginação** em todas as listagens
- **Rotas protegidas**: redireciona para login quando não autenticado
- **Navegação em breadcrumb** entre os níveis (apiário → colmeia → inspeção)

## Link do Vídeo de Demonstração

> *(a ser inserido após a gravação)*
