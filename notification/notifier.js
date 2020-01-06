const socketIO = require("socket.io");
function Notifier(http){
    let onlineUserPool = {}; //{socket.id: username}
    let onlineUserPool2 = {};// {username: socket.id}
    this.io = socketIO.listen(http);
    this.io.on("connection", (socket) => {
        console.log('user connected',socket.id);
        socket.on("disconnect", () => { 
        console.log('user disconnected', socket.id);
        let username = onlineUserPool[socket.id];
        delete onlineUserPool[socket.id];
        delete onlineUserPool2[username];
        console.log('online user list',JSON.stringify(onlineUserPool));
        });
        socket.on('login',(data)=>{
            onlineUserPool[socket.id] = data.username.toLowerCase();
            onlineUserPool2[data.username.toLowerCase()] = socket.id;
            console.log('online user list',JSON.stringify(onlineUserPool));
        });
        socket.on('unreadMessage',(data)=>{
            console.log('unreadMessage to', data.username);
            let userSocketId = onlineUserPool2[data.username];
            if(userSocketId){
                socket.to(userSocketId).emit('unreadMessage',data);
            }
        })
    });

}
module.exports = Notifier;