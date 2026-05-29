import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp({ 
            format: 'YYYY-MM-DD HH:mm:ss' 
        }), 
        winston.format.printf(info => `${info.timestamp} ${info.level}:  ${info.message}`) 
    ), 
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/app.log' }),
        new winston.transports.File({filename: './logs/error.log', level: 'error'})
    ] 
}); 

export default logger;