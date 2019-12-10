const redis = require('redis');

function HistoryStore() {
    const client = redis.createClient(6379, '127.0.0.1');

    client.on('connect', (err) => {
        console.log('redis connect successfully'); 
    });

    this.appendMessage = function(from, to, content, time){
        const key = generateKey(from,to);
        const body = {
            'from': from,
            'to': to,
            'content': content,
            'time': time
        }
        return new Promise( (resolve,reject)=>{
            client.rpush(key, JSON.stringify(body), (err, data) => {
                if(err){
                    reject(err);
                }else{
                    //console.log(data);
                    resolve(data);
                } 
            })
        })
    };
    this.appendMessages = function(from,to,messages){
        const key = generateKey(from,to);
        let messagesStringArr = [];
        if(messages && messages.length > 0){
            messages.forEach((msg)=>{
                messagesStringArr.push(JSON.stringify(msg));
            });
        }
        return new Promise( (resolve,reject)=>{
            if(messagesStringArr.length === 0){
                resolve();
            }else{
                client.rpush(key, messagesStringArr, (err, data) => {
                    if(err){
                        reject(err);
                    }else{
                        console.log(data);
                        resolve(data);
                    } 
                })
            }    
        })
    };

    this.queryMessages = function(from, to){
        const key = generateKey(from,to);
        return new Promise((resolve, reject)=>{
            client.lrange(key, 0, -1, (err,data)=>{
                if(err){
                    reject(err);
                }else{
                    //console.log(data);
                    let arr = [];
                    data.forEach((item) => {
                        arr.push(JSON.parse(item));
                    });
                    resolve(arr);
                } 
            });
        });
        
    }

    function generateKey(from, to){
        return [from.toLowerCase(),to.toLowerCase()].sort().join(':');
    }
}


module.exports = new HistoryStore();