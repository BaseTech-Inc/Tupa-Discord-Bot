<div align="center">
<img align="center" width="24%" src="./.github/logo.png" />
<br>
<i>
    Discord Bot da empresa Tupã
</i>
</div>

## Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

## Começando

### Instalando localmente projeto

```bash
# Clone o repositório em sua máquina
$ git clone https://github.com/BaseTech-Inc/Tupa-Discord-Bot.git
```

### Configurando ambiente


- Para este projeto é necessário ter instalado em sua maquina o <a href="https://nodejs.org/en/">NodeJs</a>.

- É nescessário registrar um bot no Discord, use o <a href="https://discord.com/developers/applications/">painel da aplicação Discord</a>

- Variaveis de ambiente 
    Renomeie o arquivo <code>.env_.ample</code> para <code>.env</code>. <br />
    É nescessário inserir os seguintes valores:
    
    ```env
    BOTTOKEN=YOUR_BOT_TOKEN
    CLIENTID=CLIENT_ID
    ```

### Usando projeto

```bash
# Vá para a pasta do projeto
$ cd discord-bot/

# Instalar dependências
$ npm install npm@latest -g
$ npm install

# Executar aplicativo
$ npm start
```

## Arquitetura

- Arquitetura
  - `src/`
    - `commands/`
        - `command/`
            - `command.js`
    - `common/`
        - `common.js`
    - `database/`
        - `migrations/`
    - `events/`
        - `guildMemberAdd.js`
        - `guildMemberRemove.js`
        - `messageCreate.js`
        - `interactionCreate.js`
        - `ready.js`
    - `index.js`

<img src="https://github.githubassets.com/images/mona-whisper.gif" align="right" />

## Licença

Esse projeto está sob licença. Veja o arquivo [`LICENÇA`](https://github.com/BaseTech-Inc/Tupa-Discord-Bot/blob/master/LICENSE) para mais detalhes.