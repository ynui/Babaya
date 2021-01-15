var express = require('express');
var router = express.Router();
const userUtils = require('../src/Users/userUtils')
const groupUtils = require('../src/Groups/groupUtils');

router.use(userUtils.validateRequest)


/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    let users = await userUtils.getAllUsers()
    res.send(users)
    res.end()
  } catch (error) {
    next(error)
  }
});

router.get('/allUsersDetails', async (req, res, next) => {
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

router.post('/register', async (req, res, next) => {
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

router.post('/login', async (req, res, next) => {
  try {
    let resault = await userUtils.login(req.body.email, req.body.password)
    res.send(resault)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.get('/logout', async (req, res, next) => {
  try {
    let success = await userUtils.logout()
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/update', async (req, res, next) => {
  try {
    let success = await userUtils.updateProfile(req.body.userId, req.body)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.route('/:userId')
  .get(async (req, res, next) => {
    try {
      let user = await userUtils.getUser(req.params.userId)
      res.send(user.data)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.post('/addGroup', async (req, res, next) => {
  try {
    let user = await userUtils.addGroup(req.body.userId, req.body.groupId)
    let group = await groupUtils.addUser(req.body.groupId, req.body.userId)
    res.send({
      user: user.data,
      group: group
    })
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/resetPassword', async (req, res, next) => {
  try {
    let success = await userUtils.resetPassword(req.body.email)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

module.exports = router;
