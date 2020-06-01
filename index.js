const winston = require('winston'),
    WinstonCloudWatch = require('winston-cloudwatch');

/**
    *   Returns a logger instance
    *   @param {string} stream_name - Name of Cloudwatch Stream
    *   @param {string} group_name - Name of Cloudwatch Log Group
    *   @param {string} aws_region - AWS Region
    *   @param {boolean} [console_logging=false] - Enable/Disable the console logging
    *   @returns {Object} Winston Instance 
*/
const logger_wrapper = (stream_name, group_name, aws_region, console_logging = false) => {
    const logStreamName = stream_name,
        logGroupName = group_name || process.env.LOG_GROUP,
        awsRegion = aws_region || "ap-south-1";
    if(!logStreamName || !logGroupName) throw new Error("Configure the Logger properly, pass stream name and group name");
    const options = {
        format: winston.format.json(),
        transports: []
    };
    if (console_logging) options.transports.push(new(winston.transports.Console)({
        timestamp: true,
        colorize: true,
    }));
    const logger = new winston.createLogger(options);
    const cloudwatchConfig = {
        logGroupName,
        logStreamName: "[ " + process.env.NODE_ENV + " ] / " + logStreamName,
        awsRegion,
        messageFormatter: ({ level = "info", message }) => {
            return `[${level}] : ${JSON.stringify(message)}`
        }
    };
    logger.add(new WinstonCloudWatch(cloudwatchConfig));
    return logger;
};

module.exports = logger_wrapper