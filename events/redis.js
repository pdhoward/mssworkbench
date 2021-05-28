
const Redis =                       require('ioredis')
const { g, b, gr, r, y } =          require('../console');

///////////////////////////////////////////////
////////////// pub sub server ////////////////
/////////////////////////////////////////////

let redisport = process.env.REDISPORT;
let redishost = process.env.REDISHOST;
let redispassword = process.env.REDISPASSWORD;
let options = {
    port: redisport,
    host: redishost,
    password: redispassword,
    lazyConnect: true }
  
exports.redisevents = () => {
    return new Promise(async(resolve, reject)=> {
        const pub = new Redis(options)        
        const redis = new Redis(options)  
        redis.subscribe('watch', function (err, count) {
            console.log(`Currently tracking ${count} channels`)
        });
        redis.on('error', function (err) {
            console.log('Redis error: ' + err);
        });
        redis.on('connect', function (err) {
            console.log(g(`Redis events registered`))
            resolve({pub, redis})
        });                
    })   
}
