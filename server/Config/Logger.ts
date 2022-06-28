const SERVER = 'server';
const INFO = 'INFO';
const WARNING = 'WARNING';
const ERROR = 'ERROR';

function formatMessage(logType: string, message: string, identifier?: string) {
    return `[${SERVER}][${logType}]${identifier ? `[${identifier}]` : ''} ${message}`;
}

export function logInfo(message: string, identifier?: string) {
    console.log(formatMessage(INFO, message, identifier));
}
export function logWarn(message: string, identifier?: string) {
    console.warn(formatMessage(WARNING, message, identifier));
}
export function logError(message: string, identifier?: string) {
    console.error(formatMessage(ERROR, message, identifier));
}