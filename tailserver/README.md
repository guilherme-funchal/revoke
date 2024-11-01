<h1 align="center"><b>Servidor de arquivo tails de exemplo</b></h1>

Este é um servidor muito simples que pode ser usado para hospedar arquivos tails do AnonCreds. Ele deve ser usado apenas para fins de desenvolvimento.

Ele oferece um único ponto de extremidade na raiz que recebe um `tailsFileId` codificado em URI como caminho de URL e permite fazer upload (usando o método PUT e um formulário codificado em várias partes) ou recuperar um arquivo tails (usando o método GET).

1.Para instalar: 
```bash
#npm install
```

2.Para executar: 
```bash
#npm start
```
