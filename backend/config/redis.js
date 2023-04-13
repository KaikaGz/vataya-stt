const redis = require('redis');
const reidsclient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
reidsclient.on('connect', function () {
  console.log('Redis Connected');
});
reidsclient.on('error', function (err) {
  console.log(err);
});

module.exports = reidsclient;
