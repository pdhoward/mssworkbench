
require('dotenv').config({ silent: true });
const { SERVER_PORT } = require( "./config")
const { start } = require( "./xserver")

////////////////////////////////////////////////////////////////
////////       Stream to Message Connector              ////////
//////             Kafka to Redis                      ///////
//////c strategic machines 2018 all rights reserved   ///////
////////////////////////////////////////////////////////////

async function main() {
	await start(SERVER_PORT);
	console.log(`Server started at http://localhost:${SERVER_PORT}`);
}

main().catch(error => console.error(error));
