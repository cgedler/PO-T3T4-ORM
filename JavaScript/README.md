# Uso de los ORM con JavaScript ✨ / Node.JS-Sequelize

# Comandos

### 1. Crear servidor b&#225;sico con Express:

```shell
npm init -y // crea el package.json
```

### 1.1 Instalar los modulos principales para creear un servidor:

####  Modulos:

- **Express:** Es un framework encargado de ser el servidor de la aplicaci&#243;n.
- **Morgan:** Es modulo que ayuda a ver por consola las peticiones que van llegando a la aplicacion.
- **ejs:** Es un modulo para generar las paginas html, extendidas con logica de programacion. **(Opcional si no es Backend)**
- **winston:** Implementa una clase de logging en un proyecto de Node.js con Express.
- **Sequelize:** ORM de Base de Datos.


```shell
npm i express morgan cors jsonwebtoken winston dotenv bcryptjs
```

```shell
npm install --save-dev nodemon
```

```shell
npm install --save sequelize
```

**Conector al SGDB**

```shell
$ npm install --save pg pg-hstore # Postgres
$ npm install --save mysql2
$ npm install --save mariadb
$ npm install --save sqlite3
$ npm install --save tedious # Microsoft SQL Server
$ npm install --save oracledb # Oracle Database
```

### 1.2 Configuracion en `package.json`:

```json
 "type": "module",  // le indico que voy a estar utilizando los exports e imports
```

### 1.3 Crear en `/src` el archivo principal `main.js`

### 2. Estructura de las carpetas

```shell
src/
│── config/        ← Configuración de DB y variables de entorno.
│── controllers/        ← Lógica de negocio.
│── logs/        ← Logs de la aplicación.
│── middleware/        ← Lógica de logs.
│── models/        ← Definición de las tablas como objetos.
│── routes/        ← Definición de los endpoints.
│── services/        ← Servicios.
```

## 3. Configuraci&#243;n de Sequelize

- En el archivo `config/environment.js`, leemos la informaci&#243;n de la conexi&#243;n de la base de datos del archivo `envconfig.json`.

**`envconfig.json`:**

```json
{
    "name": "cge",
    "database": {
        "name" : "nodejwt",
        "username" : "cge",
        "password" : "123456",
        "host": "127.0.0.1",
        "port": 3306,
        "dialect": "mysql",
        "encrypt": false,
        "storage": "path"
    }
}
```
**`environment.js`:**

```javascript
import { readFile } from 'fs/promises';

const config = JSON.parse(
  await readFile(new URL('../envconfig.json', import.meta.url))
);

export default config;
```

- En el archivo `config/database.js`, estableceremos la conexi&#243;n. Sequelize requiere el nombre de la base de datos, usuario y contrase&#241;a para funcionar.

**`database.js`:**

```javascript

import Sequelize from 'sequelize';
import config from './environment.js';

import { MSSql } from './mssql.connection.js';
import { MySql } from './mysql.connection.js';
import { Postgres } from './postgres.connection.js';
//import { SQLite } from './sqlite.connection.js';

var db;

switch(config.database.dialect) {
  case 'mssql':
    db = MSSql;
    break;
  case 'mysql':
    db = MySql;
    break;
  case 'postgres':
    db = Postgres;
    break;
  //case 'sqlite':
    //db = SQLite;
    //break;
  default:
    console.error('Unable to connect to the database - HandlerDB');
}

export default db;

```

## 4. Definici&#243;n de los Modelos

- En `models/user.model.js`, definiremos la estructura de la tabla.

**`user.model.js`:**

```javascript

import { DataTypes } from 'sequelize';
import db from '../config/database.js';


const Role = {
    ADMIN: "ADMIN",
    USER: "USER"
};

const User = db.define('system.users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.ENUM(Role.ADMIN, Role.USER)
    }
});

export default User;

```

### 5. Controlador de autenticaci&#243;n

**`login.controller.js`:**

```javascript

import logger from '../middleware/logger.js';
import userService from '../services/user.service.js';
import jwtoken from '../services/jwt.service.js';

export const login = async (req, res) => {
    try {
        logger.info(`Inside login controller`);
        const username = req.body?.username;
        const password = req.body?.password;
        if (!req.body) {
            logger.error(`Error: Request body is missing`);
            return res.status(400).json({ message: "Error: Request body is missing" });
        }
        if (validateParam(username) && validateParam(password)) {
            const usertoken = await userService.login(req.body);
            const user = { 
                roles: usertoken.role,
                sub: usertoken.username
            }; 
            const token = await jwtoken.generateToken(user);
            return res.json({ token });
        } else {
            logger.error(`Error: The parameters are empty or null`);
            return res.status(400).json({ message: "Error: The parameters are empty or null"});
        }
     } catch (error) {
        logger.error(`Error: ${error}`);
        return res.status(500).json({ message: "Error: " + error.message }); 
    }   
};

function validateParam(param) {
    if (!param) {
        return false;
    } else if (typeof param === "string" && param.trim().length === 0) {
        return false;
    } else if (param === null) {
        return false;
    } else {
        return true;
    }
}

```

### 6. Autenticaci&#243;n con JSON Web Token (JWT)

- En `jwt.service.js`, genera y verifique si el token enviado en el Header es v&#225;lido.

**`jwt.service.js`:**

```javascript

import logger from '../middleware/logger.js';
import Jwt from 'jsonwebtoken';
const jwt = Jwt;

export const SECRET_KEY = "586E3272357538782F413F4428472B4B6250655368566B597033733676397924";

export async function generateToken(user) {
    const token = jwt.sign({user}, SECRET_KEY );
    return token;
}

export function ensureToken(req, res, next) {
    const baererHeader = req.header('Authorization');
    if (typeof baererHeader !== 'undefined') {
        const bearer = baererHeader.split(" ");
        const baererToken = bearer[1];
        if (!baererToken) {
            return res.status(401).json({ message: "Token not provied" });
        }
        req.token = baererToken;
        next();
    } else {
        return res.status(403).json({ message: "Token not valid" });
    }
}


function verifyToken(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}


export default { generateToken, ensureToken, SECRET_KEY, verifyToken };

```


### 7. Seguridad con bcryptjs (Cifrado)

> **`bcryptjs`** utiliza un algoritmo de *"hashing"* con *"salt"* para asegurar que, aunque dos usuarios tengan la misma clave, sus hashes sean distintos.

**`user.service.js`:**

```javascript
export async function create(params) {
    if (await User.findOne({ where: { username: params.username } })) {
        throw 'User :"' + params.username + '" is already registered';
    }
    var password_crypt = '';
    if (params.password) {
        var salt = bcrypt.genSaltSync(10);
        password_crypt = bcrypt.hashSync(params.password, salt);
    }   
    const user = new User(params);
    user.password = password_crypt; 
    await user.save();
    return user;
}

export async function update(id, params) {
    const user_old = await getOne(id);
    // validate
    const usernameChanged = params.username && user_old.username !== params.username;
    if (usernameChanged && await User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    var password_crypt = '';
    if (params.password) {
        var salt = bcrypt.genSaltSync(10);
        password_crypt = bcrypt.hashSync(params.password, salt);
    }
    user_old.username = params.username;
    user_old.name = params.name;
    user_old.password = password_crypt;
    user_old.role = params.role;
    await user_old.save();
    return user_old;
}
```
