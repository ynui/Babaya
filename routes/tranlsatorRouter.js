const express = require('express');
const router = express.Router();
const translator = require('../src/translator')

router.route('/')
    .post((req, res, next) => {
        try {
            let resault = translator.getItem(req.body.dictionary, req.body.query, req.body.lang)
            res.send(resault)
            res.end()
        } catch (error) {
            next(error)
        }
    })

    router.route('/:dictionaryName')
    .post((req, res, next) => {
        try {
            let resault = translator.getAllItems(req.params.dictionaryName)
            res.send(resault)
            res.end()
        } catch (error) {
            next(error)
        }
    })
module.exports = router;
