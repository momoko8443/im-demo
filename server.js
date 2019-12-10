var messageAPI = require('./router.js');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();

const http = require('http').createServer(app);
const notifier = require('./notification/notifier')(http);

app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/messages', messageAPI);


http.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});
