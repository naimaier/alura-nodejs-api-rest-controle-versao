# alura-nodejs-api-rest-controle-versao
## Config file
Create a file named config/default.js containing:
```
{
    "mysql": {
        "banco-de-dados": "petshop",
        "usuario": "username"
        "senha": "password"
        "host": "127.0.0.1"
    },
    "api": {
        "porta": 3000
    }
}
```
## Run
Install dependencies
```
npm install
```
Run server
```
node api/index.js
```
