# apirest
- Certifique-se de ter instalado o NodeJS com versão >= 11.9.0, execute no terminal <b>node -v</b>. Caso não aparece a versão [clique aqui](https://nodejs.org/en/) <br>
- Na pasta raiz da aplicação execute no terminal <b>npm install</b>
- Crie no seu diretório um arquivo chamado <b> .env </b>
  - Dentro desse arquivo vão ficar as suas variávies de ambiente, são elas:
     - MONGO_USER= <USUÁRIO_MONGO>
     - MONGO_PASS= <SENHA_DO_USUÁRIO_MONGO>
     - MONGO_CLUSTER= <[CLUSTER_ATALAS_MONGO](https://cloud.mongodb.com/user#/atlas/login)> Optei por usar o mongoBD atlas
     - MONGO_DATABASE= <BANCO_DO_MONGO>
     - SECRET= <[CHAVE_ÚNICA_PARA_GERAR_SEU_TOKEN](http://www.miraclesalad.com/webtools/md5.php)> Crie uma chave com qualquer palavra; EX: <i>noderest</i> e converta pra MD5
- No terminal execute agora <b>npm run-script dev</b> para iniciar o nodemon na versão de desenvolvimento, assim toda vida que salvar um arquivo <b>.js</b> automaticamente o servido é atualizado
- No Browser ou no seu Rest Client execute http://localhost:3000 para verificar se está tudo OK!
- Rotas já criadas: 
     - <i>/auth/regiseter</i>
     - <i>/auth/login</i>
     - <i>/users</i>
     - <i>/users/{id}</i>
