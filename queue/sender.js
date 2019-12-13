const amqp  = require('amqplib/callback_api');
const queueName = 'thread-im';

function Sender(){
    let messageChannel;
    amqp.connect('amqp://guest:guest@localhost/my_vhost',(error0, connection)=>{
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
            messageChannel = channel;
        })
    });
    this.sendMessage = function(from, to, content){
        const msgBody = {
            'from': from,
            'to': to,
            'content': content,
            'time': Date.now()
        };
        const msgString = JSON.stringify(msgBody);
        messageChannel.sendToQueue(queueName, Buffer.from(msgString));
        console.log(" [X] Sent %s", msgString);
    }
}

module.exports = new Sender();