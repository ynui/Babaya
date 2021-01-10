var express = require('express');
var router = express.Router();
const groupUtils = require('../src/Groups/groupUtils')

router.get('/', async (req, res, next) => {
  try {
    let groups = await groupUtils.getAllGroups()
    res.send(groups)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
});

router.get('/:groupId', async (req, res, next) => {
  try {
    let groups = await groupUtils.getGroup(req.params.groupId)
    res.send(groups)
    res.end()
  } catch (error) {
    res.send(error)
    res.end()
  }
});


router.post('/create', async (req, res, next) => {
  try {
    let newGroup = await groupUtils.createGroup(req.body)
    newGroup = await groupUtils.writeGroupDetails(newGroup)
    res.send(newGroup.data)
    res.end()
  } catch (error) {
    console.error(`error creating group ${error}`)
    res.send(error)
    res.end()
  }
});


module.exports = router;
