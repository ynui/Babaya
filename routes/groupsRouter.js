var express = require('express');
var router = express.Router();
const groupUtils = require('../src/Groups/groupUtils')
const Utils = require('../src/Utils')

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

router.get('/:groupId', async (req, res, next) => {
  try {
    let groups = await groupUtils.getGroup(req.params.groupId)
    res.send(groups)
    res.end()
  } catch (error) {
    next(error)
  }
});

router.post('/create', async (req, res, next) => {
  try {
    let newGroup = await groupUtils.createGroup(req.body)
    let success = await groupUtils.writeGroupDetails(newGroup)
    res.send(newGroup.data)
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

module.exports = router;