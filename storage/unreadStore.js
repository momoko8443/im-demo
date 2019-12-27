const redis = require('redis');

function UnreadStore() {
    const client = redis.createClient(6379, '127.0.0.1');

    client.on('connect', (err) => {
        console.log('redis connect successfully'); 
    });

    this.appendMessage = function(from, to, messageBody){
        from = from.toLowerCase();
        to = to.toLowerCase();
        const key = to;
        const body = messageBody;
        return new Promise( (resolve,reject)=>{
            this.queryMessages(from, to).then((result)=>{
                if(!result){
                    result  = [];
                }
                result.push(body);
                client.hset(key, from, JSON.stringify(result), (err, data) => {
                    if(err){
                        reject(err);
                    }else{
                        //console.log(data);
                        resolve(data);
                    } 
                })
            })
        })
        
    };

    this.queryMessages = function(from,to){
        from = from.toLowerCase();
        to = to.toLowerCase();
        const key = to;
        return new Promise((resolve, reject)=>{
            client.hget(key, from, (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    //console.log(data);
                    resolve(JSON.parse(data));
                } 
            });
        }); 
    };

    this.removeMessages = function(from, to){
        from = from.toLowerCase();
        to = to.toLowerCase();
        return new Promise((resolve, reject)=>{
            client.hdel(to, from, (err)=>{
                if(err){
                    reject(err);
                }else{
                    resolve();
                } 
            })
        });
    }

    function generateKey(from, to){
        return [from.toLowerCase(),to.toLowerCase()].sort().join(':');
    }
}


module.exports = new UnreadStore();