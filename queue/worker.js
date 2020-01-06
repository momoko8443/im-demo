const amqp = require('amqplib/callback_api');
const unreadStore = require('../storage/unreadStore');
const queueName = 'thread-im';
const db = require('../data/db');
const socket = require('socket.io-client')('http://localhost:3000');
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'guest:guest@localhost';
function Worker(){
    socket.emit('login',{username:'worker'});
    amqp.connect('amqp://' + RABBITMQ_URL, (error0, connection)=>{
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
                const isGroup = body.isGroup;
                if(isGroup){
                    const groupName = body.to;
                    const members = db.getMembersByGroup(groupName);
                    for (let i = 0; i < members.length; i++) {
                        const member = members[i];
                        const msgBody = {
                            from: body.from,
                            to: member,
                            content:body.content,
                            time: body.time
                        };
                        (function(from, to, message){
                            unreadStore.appendMessage(from, to , message).then((result)=>{
                                console.log('record message to unreade storage');
                                if(to !== msgBody.from){
                                    socket.emit('unreadMessage',{username:member, from: from,message:message});
                                }
                            });
                        })(groupName,member,msgBody); 
                    }
                }else{
                    unreadStore.appendMessage(body.from, body.to,body).then((result)=>{
                        console.log('record message to unreade storage');
                        socket.emit('unreadMessage',{username: body.to.toLowerCase(), from:body.from ,message:body});
                    });
                }   
            }, 
            {
                noAck: true
            });
        });
    });
}
//module.exports = new Worker();
module.exports = Worker;