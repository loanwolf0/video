const fs = require('fs');
const moment = require('moment');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const env = process.env.NODE_ENV || 'development';
const winston = require('winston');

const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format: { combine, prettyPrint } } = require('winston');

const logDir = 'log';

/**
 *  Log Function
  @param {} functionName  API Name
  @param {} errorMessage  Error catch message
  @param {} userId        Login User Id
  @param {} otherParam    Other Key: Value pair object
 */
const log = (functionName, errorMessage, userId, otherParam = null) => {
    try {
        const tsFormat = () => new Date().toLocaleTimeString();
        const tsFormats = moment().format('DD MMM YYYY HH:mm:ss x');

        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

        let requestDetails = {};
        if (userId && typeof userId === 'string') requestDetails['userId'] = userId;
        else requestDetails = userId && typeof userId === 'object' ? { ...userId } : {};
        if (otherParam && typeof otherParam === 'object') requestDetails = { ...requestDetails, ...otherParam };

        const errorLogObj = {
            Time: tsFormats,
            level: 'error',
            functionName: `${functionName}`,
            ...requestDetails,
            stack: errorMessage,
        };

        const level = env === 'development' ? 'debug' : 'info';
        const errorLogger = createLogger({
            format: combine(prettyPrint()),
            transports: [
                new winston.transports.Console({
                    timestamp: tsFormat,
                    colorize: true,
                    level: 'debug',
                }),

                new (WinstonDailyRotateFile)({
                    filename: `${logDir}/${level}-`,
                    timestamp: tsFormat,
                    datePattern: 'DD-MM-YYYY',
                    prepend: true,
                    level: level,
                    maxSize: '20m',
                    maxFiles: '31d'
                }),
            ],
        });
        errorLogger.log(errorLogObj);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    Log: log,
};