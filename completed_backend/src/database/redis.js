const Redis = require("ioredis");

const client = redis.createClient ({
    host: "127.0.0.1",
    port: 6379,
})

client.on("connect", () => {
    console.log("Connection success");
});

client.on("error", (err) => {
    console.error("Redis has error:", err);
});

client.connect();

module.exports = redis;
