const express = require('express');
const router = express.Router();
const path = require('path')
// const translator = require('../src/translator')

// const Utils = require('../src/Utils')
// router.use(Utils.isRequestValid)


/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// router.route('/getCity')
//   .get((req, res, next) => {
//     try {
//       let cities = translator.cities
//       res.send(cities)
//       res.end()
//     } catch (error) {
//       next(error)
//     }
//   })
//   .post((req, res, next) => {
//     try {
//       let city = translator.findCityByName(req.body.query, req.body.lang)
//       res.send(city)
//       res.end()
//     } catch (error) {
//       next(error)
//     }
//   })

//   router.route('/getGender')
//   .get((req, res, next) => {
//     try {
//       let genders = translator.genders
//       res.send(genders)
//       res.end()
//     } catch (error) {
//       next(error)
//     }
//   })
//   .post((req, res, next) => {
//     try {
//       let gender = translator.findGenderByName(req.body.query, req.body.lang)
//       res.send(gender)
//       res.end()
//     } catch (error) {
//       next(error)
//     }
//   })

module.exports = router;
