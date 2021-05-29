// How often one can send an open request to the server (in seconds)
const OPEN_DELAY = 30

// Threshold for notification
const ELAPSED_TIME_LAST_DETECTED = 30000

// How many entries to load per page of history
const HISTORY_PAGE_SIZE = 100

// Errors
const ERR_UNAUTHORIZED = "401 Unauthorized"
const ERR_EXCESSIVE_REQUESTS = "Too many requests at one time"
const ERR_BAD_SENSOR = "Cannot read sensor"
const ERR_BAD_GATEWAY = "Did not detect a gateway (venue) object in signal"
const ERR_INVALID_MODE = "Invalid mode given"

module.exports = {
    OPEN_DELAY,
    ELAPSED_TIME_LAST_DETECTED,
    HISTORY_PAGE_SIZE,
    ERR_UNAUTHORIZED,
    ERR_EXCESSIVE_REQUESTS,
    ERR_BAD_SENSOR,
    ERR_BAD_GATEWAY,
    ERR_INVALID_MODE
}
