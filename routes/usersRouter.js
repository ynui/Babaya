var express = require('express');
var router = express.Router();
const userUtils = require('../src/Users/userUtils')
const groupUtils = require('../src/Groups/groupUtils')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    let users = await userUtils.getAllUsers()
    res.send(users)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
});

router.get('/allUsersDetails', async (req, res, next) => {
  try {
    let users = await userUtils.getAllUsersDetails()
    res.send(users)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
});


router.get('/deleteAllUsers', async (req, res, next) => {
  try {
    let success = await userUtils.deleteAllUsers()
    res.send(success)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
});

router.post('/register', async (req, res, next) => {
  try {
    let newUser = await userUtils.registerUser(req.body)
    let writeDetails = await userUtils.wriewUserDetails(newUser)
    let token = await userUtils.getToken()
    resault = {
      token: token,
      user: newUser
    }
    res.send(resault)
    res.end()
  } catch (error) {
    console.error(`error register user ${error}`)
    res.send(error)
    res.end()
  }
});

router.post('/login', async (req, res, next) => {
  try {
    let token = await userUtils.login(req.body.email, req.body.password)
    res.send(token)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

router.get('/logout', async (req, res, next) => {
  try {
    let success = await userUtils.logout()
    res.send(success)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

router.post('/updateProfile', async (req, res, next) => {
  try {
    let success = await userUtils.updateProfile(req.body)
    res.send(success)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    let user = await userUtils.getUser(req.params.userId)
    res.send(user.data)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

router.post('/:userId/addGroup', async (req, res, next) => {
  try {
    let user = await userUtils.addGroup(req.params.userId, req.body.groupId)
    let group = await groupUtils.addUser(req.body.groupId, req.params.userId)
    // res.send({
    //   user: user.data,
    //   group: group
    // })
    res.send(user)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

router.post('/resetPassword', async (req, res, next) => {
  try {
    let success = userUtils.resetPassword(req.body.email)
    res.send(success)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
})

module.exports = router;
