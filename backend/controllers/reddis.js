import Redis from "ioredis";

const redisClient = new Redis({
    host :"redis-11355.c212.ap-south-1-1.ec2.redns.redis-cloud.com" ,
    port :"11355",
    password :"wC4Cj8WeaRlPDmxIqmAEQNVMsw1CFYUi",

});

redisClient.on('connect' , ()=>{
    console.log("Reddis Connected")
})


export default redisClient;