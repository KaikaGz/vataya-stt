## Node Authentication API using Passport and JWT's

### TECHNOLOGIES/NPM MODULES

1. passport
2. passport-jwt
3. jsonwebtoken
4. bcryptjs
5. PostgreSQL
6. pg-promise
7. bluebird
8. redis

### ENDPOINTS

To register a new user:

`POST /users/new`

To login (receive a token in the response):

`POST /users/authenticate`

In request, send "Authorization" Header with the token to:

`GET /users/profile`

### DOWNLOAD PROJECT & INSTALL

1. Git clone this project
2. Open up Terminal or Command line
3. Navigate to the directory where the project was cloned to
4. Run this command: psql -f ./config/db/schema.sql
5. This command will create a PostgreSQL database along with the tables
6. Setup environment variables:
   - Create .env file in your project root with these two variables

```
DATABASE_URL=postgres://postgres:example@127.0.0.1:5432/dbname
REDIS_PORT=6379
REDIS_URL=127.0.0.1
```

7. To run the application, you need to install the dependencies, run this command: npm install --save
8. To start the application, run this command: npm start
9. The application will run at: localhost:3000, if that port is already in use, run this command: PORT=1738 npm start
10. This command will start the server at: localhost:1738
