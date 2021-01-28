var express = require('express');
var router = express.Router();
const groupUtils = require('../src/Groups/groupUtils')
const userUtils = require('../src/Users/userUtils')
const Utils = require('../src/Utils');
const { route } = require('./usersRouter');

router.use(groupUtils.validateRequest)
router.use(Utils.isRequestValid)

router.get('/', async (req, res, next) => {
  try {
    let groups = await groupUtils.getAllGroups()
    res.send(groups)
    res.end()
  } catch (error) {
    next(error)
  }
});


router.route('/:groupId')
  .get(async (req, res, next) => {
    try {
      let groups = await groupUtils.getGroup(req.params.groupId)
      res.send(groups)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .delete(async (req, res, next) => {
    try {
      let success = await groupUtils.deleteGroup(req.params.groupId)
      res.send(success)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.post('/create', async (req, res, next) => {
  try {
    let newGroup = await groupUtils.createGroup(req.body)
    let updatedUser = await userUtils.addGroup(newGroup.createUser, newGroup.groupId)
    let success = await groupUtils.writeGroupDetails(newGroup)
    res.send({
      group: newGroup.data,
      user: updatedUser
    })
    res.end()
  } catch (error) {
    next(error)
  }
});

router.post('/update', async (req, res, next) => {
  try {
    let success = await groupUtils.updateGroup(req.body.groupId, req.body)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/delete', async (req, res, next) => {
  try {
    let success = await groupUtils.deleteGroup(req.body.groupId)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
})

router.post('/removeUser', async (req, res, next) => {
  try {
    let group = await groupUtils.removeUser(req.body.groupId, req.body.userId)
    let user = await userUtils.removeGroup(req.body.userId, req.body.groupId)
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