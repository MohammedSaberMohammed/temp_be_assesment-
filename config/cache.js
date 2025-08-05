// Todo: We can use redis for caching
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 });

module.exports = cache;
