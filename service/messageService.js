const express = require('express');
const Sender = require('../queue/sender');
const Worker = require('../queue/worker');
const historyStore = require('../storage/historyStore');
const unreadStore = require('../storage/unreadStore');
const router = express.Router();
const sender = new Sender();
router.get('/', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    historyStore.queryMessages(from ,to).then((result)=>{
        if(!result){
            result = [];
        }
        res.send(result);
    });
})

router.get('/unread', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    unreadStore.queryMessages(from,to).then((result)=>{
        if(!result){
            result = [];
        }
        res.send(result);
    });
})

router.delete('/unread', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    unreadStore.queryMessages(from,to).then((unreadMessages)=>{
        return historyStore.appendMessages(from, to, unreadMessages).then((result1)=>{
            return result1;
        }).then((data)=>{
            unreadStore.removeMessages(from,to).then((result)=>{
                res.send(result);
            });
        });
    });
})


router.post('/', (req, res) => {
    let msg = req.body;
    sender.sendMessage(msg.from, msg.to, msg.content,msg.isGroup);
    res.send(msg);
})

module.exports = router;