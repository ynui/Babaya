const express = require('express');
const router = express.Router();
const dbActions = require('../fbActions')
const { firebase, admin } = require('../fbConfig')
const filesUpload = require('express-fileupload')


router.post('/upload', filesUpload(), (req, res, next) => {
    let userId = firebase.auth().currentUser.uid;
    dbActions.uploadImage(req.files, userId)
        .then((url) => {
            res.end(JSON.stringify(url))
        }).catch((error) => {
            res.end('Upload Error ' + error)
        })
});

module.exports = router;