# Controle de Equipamentos

Sistema web para gerenciamento de equipamentos, colaboradores e empréstimos, desenvolvido para facilitar o controle de recursos e o acompanhamento das devoluções.

**Projeto de portfólio — Desenvolvimento Back-end Java**

## Demonstração

**Aplicação publicada:**  
https://sistema-emprestimo-java.onrender.com

**Repositório:**  
https://github.com/rebeca-miguel/sistema-emprestimo-java

## Funcionalidades

- **Dashboard:** visualização de indicadores e resumo das movimentações.
- **Equipamentos:** cadastro e gerenciamento de equipamentos.
- **Colaboradores:** cadastro e gerenciamento de colaboradores.
- **Empréstimos:** registro e acompanhamento de empréstimos.
- **Devoluções:** registro da devolução dos equipamentos.
- **Controle de disponibilidade:** atualização da disponibilidade dos equipamentos conforme as movimentações.
- **Interface responsiva:** adaptação para computadores, tablets e celulares.

## Tecnologias utilizadas

### Back-end
- Java 25
- Spring Boot
- Spring Data JPA
- API REST
- Maven
- Docker

### Front-end
- React
- TypeScript
- Vite
- HTML
- CSS

### Ferramentas
- Git e GitHub
- IntelliJ IDEA
- Render

## Arquitetura do projeto

O projeto utiliza uma arquitetura integrada, com backend responsável pelas regras de negócio e persistência dos dados, e frontend responsável pela interface e interação com o usuário.

O frontend consome os endpoints da API REST desenvolvida com Spring Boot.

## Estrutura do projeto

```text
sistema-emprestimo-java/
│
├── src/
│   └── main/
│       ├── java/
│       └── resources/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── pom.xml
├── Dockerfile
└── README.md
```

## Como executar o projeto localmente

### Pré-requisitos

- Java 25
- Maven
- Node.js 22 ou superior
- npm
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/rebeca-miguel/sistema-emprestimo-java.git
```

### 2. Executar o back-end

Entre na pasta principal do projeto:

```bash
cd sistema-emprestimo-java
```

Execute a aplicação:

```bash
mvn spring-boot:run
```

O backend ficará disponível em:

```text
http://localhost:8080
```

### 3. Executar o front-end

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

Para executar localmente, configure o endereço da API no arquivo `frontend/src/api.ts` para apontar para o backend local.

## Testes automatizados

O projeto possui testes automatizados no backend.

Para executá-los:

```bash
mvn test
```

## Publicação

A aplicação está publicada no Render, utilizando Docker para compilar e executar o frontend e o backend no mesmo serviço.

## Objetivo do projeto

Este projeto foi desenvolvido como objetivo de aplicar conhecimentos em desenvolvimento back-end Java, construção de APIs REST, integração com interfaces web, testes automatizados e publicação de aplicações.

Também representa uma oportunidade de praticar organização de código, resolução de problemas e desenvolvimento de uma solução completa.

---

**Desenvolvido por Rebeca Miguel**

GitHub: https://github.com/rebeca-miguel