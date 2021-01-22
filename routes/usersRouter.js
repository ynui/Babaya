var express = require('express');
var router = express.Router();
const Utils = require('../src/Utils')
const userUtils = require('../src/Users/userUtils')
const groupUtils = require('../src/Groups/groupUtils');

// router.use(userUtils.validateRequest)
// router.use(Utils.isRequestValid)

const middleware = [userUtils.validateRequest, Utils.isRequestValid]

/* GET users listing. */
router.get('/', middleware, async (req, res, next) => {
  try {
    let users = await userUtils.getAllUsers()
    res.send(users)
    res.end()
  } catch (error) {
    next(error)
  }
});

router.get('/allUsersDetails', middleware, async (req, res, next) => {
  try {
    let users = await userUtils.getAllUsersDetails()
    res.send(users)
    res.end()
  } catch (error) {
    next(error)
  }
});


// router.get('/deleteAllUsers', async (req, res, next) => {
//   try {
//     let success = await userUtils.deleteAllUsers()
//     res.send(success)
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// });

router.post('/register', middleware, async (req, res, next) => {
  try {
    let newUser = await userUtils.registerUser(req.body)
    let writeDetails = await userUtils.wriewUserDetails(newUser)
    let token = await userUtils.getToken()
    let verificationEmail = userUtils.sendVerificationEmail(newUser)
    resault = {
      token: token,
      user: newUser
    }
    res.send(resault)
    res.end()
  } catch (error) {
    next(error)
  }
});

router.post('/login', middleware, async (req, res, next) => {
  try {
    let resault = await userUtils.login(req.body.email, req.body.password)
    res.send(resault)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.get('/logout', middleware, async (req, res, next) => {
  try {
    let success = await userUtils.logout()
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/update', middleware, async (req, res, next) => {
  try {
    let success = await userUtils.updateProfile(req.body.userId, req.body)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.route('/:userId')
  .all((req, res, next) => {
    if (req.method === 'POST')
      req.customURL = ':userId';
    next()
  })
  .get(middleware, async (req, res, next) => {
    try {
      let resault = await userUtils.getReadableUser(req.params.userId)
      res.send(resault)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .post(middleware, async (req, res, next) => {
    try {
      let resault = await userUtils.getReadableUser(req.params.userId, req.body.langId)
      res.send(resault)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.post('/addGroup', middleware, async (req, res, next) => {
  try {
    let user = await userUtils.addGroup(req.body.userId, req.body.groupId)
    let group = await groupUtils.addUser(req.body.groupId, req.body.userId)
    res.send({
      user: user,
      group: group
    })
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/resetPassword', middleware, async (req, res, next) => {
  try {
    let success = await userUtils.resetPassword(req.body.email)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/removeGroup', middleware, async (req, res, next) => {
  try {
    let user = await userUtils.removeGroup(req.body.userId, req.body.groupId)
    let group = await groupUtils.removeUser(req.body.groupId, req.body.userId)
    res.send({
      user: user,
      group: group
    })
    res.end()
  } catch (error) {
    next(error)
  }
})

module.exports = router;
