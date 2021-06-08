const { resolve } =require("path")
const { config } = require( "dotenv")
config({ path: resolve(__dirname, "../.env") })

const SERVER_PORT = parseInt(process.env.PORT || `9999`);
const SCHEMA_REGISTRY_URL = process.env.SCHEMA_REGISTRY_URL || `http://localhost:8081`;
const KAFKA_URLS = (process.env.KAFKA_URLS || `localhost:9092`).split(`,`);
const KAFKA_CONNECT_URL = process.env.KA

module.exports = {
    SERVER_PORT,
    SCHEMA_REGISTRY_URL,
    KAFKA_URLS,
    KAFKA_CONNECT_URL

}
