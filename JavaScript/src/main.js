
import express from 'express';
import cors from 'cors';

import logger from './middleware/logger.js'
import config from './config/environment.js';
import db from './config/database.js';
import routes from './routes/index.js';

// Models
import User from './models/user.model.js';
import Seccion from './models/seccion.model.js';
import Estudiantent from './models/estudiante.model.js';

// Configuration
const app = express();
const port = 3000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Routes
app.use('/', routes);

async function main() {
    try {
        await db.sync();  //{force:true}
        app.listen(port);
        logger.info(`Servidor ejecutándose en http://localhost:${port}`);
    } catch (error) {
        logger.error(`Unable to connect to the database: ${error}`);
    }
}
main();