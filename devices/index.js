  
const fetch = require('node-fetch')
const config = require('./cache')

/**
 * Send a request to the Pi to effect a movement
 */
export function sendMoveRequest() {
    return new Promise((resolve, reject) => {
        fetch({
            url: `http://${config.get("pi.ip")}:${config.get("pi.port")}/move/${config.get("secret")}`,
            timeout: 2000
        }, (error, response, body) => {
            if (error || response.statusCode != 200)
                reject(error)

            resolve(body)
        })
    })
}

/**
 * Send a request to the Pi to read the magnetic switch to read status
 */
export function getStatus() {
    return new Promise((resolve, reject) => {
        fetch({
            url: `http://${config.get("pi.ip")}:${config.get("pi.port")}/status/${config.get("secret")}`,
            timeout: 2000
        }, (error, response, body) => {
            if (error || response.statusCode != 200)
                reject(error)

            resolve(body)
        })
    })
}