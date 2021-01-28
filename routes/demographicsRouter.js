var express = require('express');
var router = express.Router();
const demographicUtils = require('../src/Demographics/demographicUtils')
const Utils = require('../src/Utils');
const { route } = require('./usersRouter');


const middleware = [demographicUtils.validateRequest, Utils.isRequestValid]


router.get('/', middleware, async (req, res, next) => {
  try {
    let demographics = await demographicUtils.getAllDemographics()
    res.send(demographics)
    res.end()
  } catch (error) {
    next(error)
  }
});


router.route('/:demographicId')
  .all((req, res, next) => {
    if (req.method === 'POST')
      req.customURL = '/update';
    next()
  })
  .get(middleware, async (req, res, next) => {
    try {
      let demographics = await demographicUtils.getDemographic(req.params.demographicId)
      res.send(demographics)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .delete(middleware, async (req, res, next) => {
    try {
      let success = await demographicUtils.deleteDemographic(req.params.demographicId)
      res.send(success)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .post(middleware, async (req, res, next) => {
    try {
      let success = await demographicUtils.updateDemographic(req.params.demographicId, req.body)
      res.send(success)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.post('/create',middleware, async (req, res, next) => {
  try {
    let newDemographic = await demographicUtils.createDemographic(req.body)
    // let updatedUser = await userUtils.addDemographic(newDemographic.createUser, newDemographic.demographicId)
    let success = await demographicUtils.writeDemographicDetails(newDemographic)
    res.send({ demographic: newDemographic.data })
    res.end()
  } catch (error) {
    next(error)
  }
});

// router.post('/update', async (req, res, next) => {
//   try {
//     let success = await demographicUtils.updateDemographic(req.body.demographicId, req.body)
//     res.send(success)
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })

router.post('/delete',middleware, async (req, res, next) => {
  try {
    let success = await demographicUtils.deleteDemographic(req.body.demographicId)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

// router.post('/removeUser', async (req, res, next) => {
//   try {
//     let demographic = await demographicUtils.removeUser(req.body.demographicId, req.body.userId)
//     let user = await userUtils.removeDemographic(req.body.userId, req.body.demographicId)
//     res.send({
//       user: user,
//       demographic: demographic
//     })
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = router;