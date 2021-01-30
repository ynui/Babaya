var express = require('express');
var router = express.Router();
const Utils = require('../src/Utils')
const userUtils = require('../src/Users/userUtils')
const groupUtils = require('../src/Groups/groupUtils');
const demographicUtils = require('../src/Demographics/demographicUtils');

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


router.delete('/allUsers', async (req, res, next) => {
  try {
    let success = await userUtils.deleteAllUsers(req.body.seriously)
    res.send(success)
    res.end()
  } catch (error) {
    next(error)
  }
});

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

// router.post('/update', middleware, async (req, res, next) => {
//   try {
//     let success = await userUtils.updateProfile(req.body.userId, req.body)
//     res.send(success)
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })

router.route('/:userId')
  .all((req, res, next) => {
    if (req.method === 'PUT')
      req.customURL = '/update';
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
  .put(middleware, async (req, res, next) => {
    try {
      let success = await userUtils.updateProfile(req.params.userId, req.body)
      res.send(success)
      res.end()
    } catch (error) {
      next(error)
    }
  })
// .post(middleware, async (req, res, next) => {
//   try {
//     let resault = await userUtils.getReadableUser(req.params.userId, req.body.langId)
//     res.send(resault)
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })

router.route('/:userId/group')
  .all((req, res, next) => {
    if (req.method === 'POST')
      req.customURL = '/createGroup';
    else if (req.method === 'PUT')
      req.customURL = '/addGroup';
    else if (req.method === 'DELETE')
      req.customURL = '/removeGroup';
    next()
  })
  .get(middleware, async (req, res, next) => {
    try {
      let groups = await groupUtils.getAllUserGroups(req.params.userId)
      res.send(groups)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .post(middleware, async (req, res, next) => {
    try {
      let newGroup = await groupUtils.createGroup(req.body, req.params.userId)
      let updatedUser = await userUtils.addGroup(newGroup.createUser, newGroup.groupId)
      let success = await groupUtils.writeGroupDetails(newGroup)
      res.send(newGroup)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .put(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.addGroup(req.params.userId, req.body.groupId)
      let group = await groupUtils.addUser(req.body.groupId, req.params.userId)
      res.send(user)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .delete(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.removeGroup(req.params.userId, req.body.groupId)
      let group = await groupUtils.removeUser(req.body.groupId, req.params.userId)
      res.send(user)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.route('/:userId/demographic')
  .all((req, res, next) => {
    if (req.method === 'POST')
      req.customURL = '/createDemographic';
    if (req.method === 'PUT')
      req.customURL = '/createDemographic';
    next()
  })
  .get(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.getUser(req.params.userId)
      let demographic = await demographicUtils.getReadableDemographic(user.demographic)
      res.send(demographic)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .put(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.addDemographic(req.params.userId, req.body)
      res.send(user)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .delete(middleware, async (req, res, next) => {
    try {
      let success = await userUtils.removeDemographic(req.params.userId, req.body.demographicId)
      res.send(success)
      res.end()
    } catch (error) {
      next(error)
    }
  })
// .put(middleware, async (req, res, next) => {
//   try {
//     let user = await userUtils.getUser(req.params.userId)
//     let demographicId = user.demographic
//     let success = await demographicUtils.updateDemographic(demographicId, req.body)
//     res.send(success)
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })
router.route('/:userId/demographic/:langId')
  .get(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.getUser(req.params.userId)
      let demographicId = user.demographic
      let demographic = await demographicUtils.getReadableDemographic(demographicId, req.params.langId)
      res.send(demographic)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.route('/:userId/demographicOther')
  .all((req, res, next) => {
    if (req.method === 'POST')
      req.customURL = '/createDemographic';
    else if (req.method === 'DELETE')
      req.customURL = '/removeDemographicOther';
    next()
  })
  .get(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.getUser(req.params.userId)
      let demographics = await demographicUtils.getReadableDemographic(user.demographicsOther)
      res.send(demographics)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .post(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.addDemographicOther(req.params.userId, req.body)
      res.send(user)
      res.end()
    } catch (error) {
      next(error)
    }
  })
  .delete(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.removeDemographicOther(req.params.userId, req.body.demographicId)
      res.send(user)
      res.end()
    } catch (error) {
      next(error)
    }
  })

router.route('/:userId/demographicOther/:langId')
  .get(middleware, async (req, res, next) => {
    try {
      let user = await userUtils.getUser(req.params.userId)
      let demographics = await demographicUtils.getReadableDemographic(user.demographicsOther, req.params.langId)
      res.send(demographics)
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

router.route('/:userId/:langId')
  .get(middleware, async (req, res, next) => {
    try {
      let resault = await userUtils.getReadableUser(req.params.userId, req.params.langId)
      res.send(resault)
      res.end()
    } catch (error) {
      next(error)
    }
  })

// router.post('/removeGroup', middleware, async (req, res, next) => {
//   try {
//     let user = await userUtils.removeGroup(req.body.userId, req.body.groupId)
//     let group = await groupUtils.removeUser(req.body.groupId, req.body.userId)
//     res.send({
//       user: user,
//       group: group
//     })
//     res.end()
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = router;
