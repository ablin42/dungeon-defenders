import AWS_DB from './AWSService';
import JSON_DB from './JsonDBService';

export default IS_DEV_ENV ? JSON_DB : AWS_DB;