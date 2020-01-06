var messageAPI = require('./service/messageService');
var userAPI = require('./service/userService');
var authAPI = require('./service/authService');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const notifier = require('./notification/notifier')(http);
const Worker = require('./queue/worker');
const worker = new Worker();

var allowCors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCors);//使用跨域中间件


app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/auth', authAPI);
app.use('/api/users',userAPI);
app.use('/api/messages', messageAPI);


http.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});
