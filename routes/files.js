const express = require('express');
const router = express.Router();
const dbActions = require('../fbActions')
const Constants = require('../Constants')
const { firebase, admin } = require('../fbConfig')


router.post('/upload', (req, res, next) => {
    let userId = firebase.auth().currentUser.uid;
    dbActions.uploadImage(req.files, userId)
        .then((url) => {
            res.end(JSON.stringify(url))
        }).catch((error) => {
            res.end('Upload Error ' + error)
        })
});

module.exports = router;