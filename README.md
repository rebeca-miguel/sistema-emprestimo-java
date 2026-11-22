# Sistema de Empréstimo de Equipamentos

API REST desenvolvida com Java 25 e Spring Boot para gerenciar o empréstimo de equipamentos de uma empresa.

O sistema permite cadastrar colaboradores e equipamentos, registrar empréstimos, controlar devoluções e identificar empréstimos em atraso.

## Tecnologias utilizadas

- Java 25
- Spring Boot
- Spring Data JPA
- H2 Database
- Maven
- JUnit 5

## Funcionalidades

- Cadastro e consulta de colaboradores.
- Cadastro, consulta, atualização e exclusão de equipamentos.
- Registro de empréstimos.
- Controle de disponibilidade dos equipamentos.
- Registro de devoluções.
- Identificação de empréstimos em atraso.
- Validação de regras de negócio.

## Endpoints da API

### Colaboradores

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/colaboradores` | Cadastrar colaborador |
| GET | `/colaboradores` | Listar colaboradores |
| GET | `/colaboradores/{id}` | Buscar colaborador por ID |
| GET | `/colaboradores/{id}/emprestimos` | Listar empréstimos do colaborador |

### Equipamentos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/equipamentos` | Cadastrar equipamento |
| GET | `/equipamentos` | Listar equipamentos |
| GET | `/equipamentos/{id}` | Buscar equipamento por ID |
| PUT | `/equipamentos/{id}` | Atualizar equipamento |
| DELETE | `/equipamentos/{id}` | Excluir equipamento |

### Empréstimos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/emprestimos?equipamentoId=1&colaboradorId=2` | Registrar empréstimo |
| GET | `/emprestimos` | Listar empréstimos |
| GET | `/emprestimos?atrasados=true` | Listar empréstimos em atraso |
| GET | `/emprestimos/{id}` | Buscar empréstimo por ID |
| PUT | `/emprestimos/{id}/devolucao` | Registrar devolução |

## Regras de negócio

- Não permitir equipamentos com número de patrimônio duplicado.
- Novos equipamentos devem estar disponíveis.
- Não permitir colaboradores com e-mail duplicado.
- Somente equipamentos disponíveis podem ser emprestados.
- O prazo padrão de empréstimo é de 14 dias.
- Não permitir devolução duplicada.
- Ao devolver um equipamento, sua disponibilidade deve ser atualizada.
- Identificar empréstimos em atraso.
- Não permitir excluir equipamentos que possuam histórico de empréstimos.
- Não permitir novos empréstimos para colaboradores com empréstimos em atraso.

## Como executar o projeto

**Pré-requisitos:**
- Java 25
- Maven

Clone o repositório:

```bash
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd emprestimo
```

Execute a aplicação:

```bash
./mvnw spring-boot:run
```

No Windows, utilize:

```powershell
.\mvnw.cmd spring-boot:run
```

A aplicação será iniciada na porta 8080, caso outra porta não seja configurada pelo ambiente.

## Banco de dados

O projeto utiliza o banco de dados H2 em modo arquivo.

Console H2 disponível localmente:

```text
http://localhost:8080/h2-console
```

## Testes automatizados

Os testes foram desenvolvidos com JUnit 5.

Para executar os testes no Windows:

```powershell
.\mvnw.cmd test
.\mvnw.cmd "-Dmaven.repo.local=C:\maven-repository" test
```

## Deploy

A aplicação será publicada no Render utilizando Docker.

**URL da API:** será adicionada após a publicação.

## Autoria

Projeto desenvolvido como atividade prática de desenvolvimento back-end Java.

- Rebeca Gaspar Miguel