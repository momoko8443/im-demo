const amqp  = require('amqplib/callback_api');
const queueName = 'thread-im';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'guest:guest@localhost/my_vhost';
function Sender(){
    let messageChannel;
    amqp.connect('amqp://' + RABBITMQ_URL,(error0, connection)=>{
        if(error0){
            console.error(error0);
            throw error0;
        }
        connection.createChannel((error1, channel)=>{
            if(error1){
                console.error(error1);
                throw error1;
            }
            channel.assertQueue(queueName,{
                durable: false
            });
            messageChannel = channel;
        })
    });
    this.sendMessage = function(from, to, content, isGroup){
        const msgBody = {
            'from': from,
            'to': to,
            'content': content,
            'isGroup': isGroup ? true: false,
            'time': Date.now()
        };
        const msgString = JSON.stringify(msgBody);
        messageChannel.sendToQueue(queueName, Buffer.from(msgString));
        console.log(" [X] Sent %s", msgString);
    }
}

//module.exports = new Sender();
module.exports = Sender;