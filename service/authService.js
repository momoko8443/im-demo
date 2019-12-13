const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/',(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.sendStatus(404);
    }
    const dbUser = Object.assign({},db.users[username]);
    if(dbUser && dbUser.password === password){
        delete dbUser['password'];
        res.send(dbUser);
    }else{
        res.sendStatus(403);
    }
})

module.exports = router;