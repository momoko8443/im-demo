var messageAPI = require('./service/messageService');
var userAPI = require('./service/userService');
var authAPI = require('./service/authService');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const notifier = require('./notification/notifier')(http);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/auth', authAPI);
app.use('/api/users',userAPI);
app.use('/api/messages', messageAPI);


http.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});
