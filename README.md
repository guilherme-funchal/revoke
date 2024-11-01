# Reproduzir a revogação

Este projeto foi criado para reproduzir um problema com revogação de credenciais na biblioteca @credo-ts/core. Siga as instruções abaixo para configurar e executar o projeto.

## Prerequisitos

- Node.js e npm instalado
- Servidor de tails rodando conforme o diretório tailserver

## Instalação

2. Instalar as dependências:
    ```bash
    npm install
    ```

## Running the Project

1. Ajustar o arquivo `.env` conforme abaixo:
    ```env
    TAILS_SERVER_BASE_URL=<your_tails_server_base_url>
    TAILS_DIRECTORY_PATH=<your_tails_directory_path>
    ```

2. Iniciar projeto:
    ```bash
    npm start
    ```

O comando `npm start` criará e iniciará o projeto, executando as seguintes etapas:

1. O emissor criará um esquema.
2. O emissor criará uma definição de credencial.
3. O emissor criará uma definição de registro de revogação e uma lista de status de revogação.
4. Uma conexão será estabelecida entre o emissor e o titular.
5. O emissor emitirá 5 credenciais anoncreds para o titular.
6. O emissor tentará revogar essas 5 credenciais.

