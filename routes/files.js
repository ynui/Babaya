const express = require('express');
const router = express.Router();
const dbActions = require('../fbActions')
const Constants = require('../Constants')
const { firebase, admin } = require('../fbConfig')


router.post('/upload', (req, res, next) => {
    let email = firebase.auth().currentUser.uid;
    dbActions.uploadImage(req.files, email)
        .then((url) => {
            console.log('in router ' + url)
            res.end(JSON.stringify(url))
        }).catch((error) => {
            res.end('error upload')
        })
});

module.exports = router;