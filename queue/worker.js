const amqp = require('amqplib/callback_api');
const unreadStore = require('../storage/unreadStore');
const queueName = 'thread-im';
const socket = require('socket.io-client')('http://localhost:3000');
function Worker(){
    socket.emit('login',{username:'worker'});
    amqp.connect('amqp://guest:guest@localhost/my_vhost', (error0, connection)=>{
        if(error0){
            throw error0;
        }
        connection.createChannel((error1, channel)=>{
            if(error1){
                throw error1;
            }
            channel.assertQueue(queueName,{
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
            channel.consume(queueName, (msg)=>{
                console.log(" [x] Received %s", msg.content.toString());
                const body = JSON.parse(msg.content.toString());
                unreadStore.appendMessage(body.from, body.to,body.content, body.time).then((result)=>{
                    console.log('record message to unreade storage');
                    socket.emit('unreadMessage',{username: body.to.toLowerCase(), message:body});
                });
            }, 
            {
                noAck: true
            });
        });
    });
}
module.exports = new Worker();