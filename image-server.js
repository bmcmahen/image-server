var connect = require("connect");
var Mage = require("./lib/mage");
var knox = require("knox");

var cacheOnS3 = true;
if (process.env.CACHE_ON_S3 === "disable") {
  cacheOnS3 = false;
}

var client = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: process.env.S3_BUCKET
});

var mage = new Mage({
  client: client,
  parallelism: parseInt(process.env.PARALLELISM, 10),
  cacheOnS3: cacheOnS3,
  bucket: process.env.S3_BUCKET,
  pattern: process.env.PATTERN,
  processorTimeout: parseInt(process.env.PROCESSOR_TIMEOUT, 10),
  downloaderTimeout: parseInt(process.env.DOWNLOADER_TIMEOUT, 10),
  maxSockets: parseInt(process.env.MAX_SOCKETS, 10)
});

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.query());
  .use(mage.middleware())
  .listen(process.env.PORT || 3000);
