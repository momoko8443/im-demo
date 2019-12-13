const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.get('/',(req, res)=>{
    let usersPool = db.users;
    let users = Object.keys(usersPool);
    res.send(users);
})

router.get('/:username', (req, res) => {
    const username = req.params.username;
    let user = db.users[username];
    delete user['password'];
    res.send(user);
})

module.exports = router;