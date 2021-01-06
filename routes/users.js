const express = require('express');
const router = express.Router();
const { firebase, admin, Constants } = require('../fbConfig')
const dbActions = require('../fbActions')



function sendError(res, error) {
  res.send(error)
  res.end()
}

function getUserDataFromRequest(req) {
  let userData = {
    email: req.email,
    phoneNumber: req.phoneNumber,
    firstName: req.firstName,
    lastName: req.lastName,
    language: req.language,
    accountType: req.accountType,
    gender: req.gender || null,
    addressCity: req.addressCity || null,
    addressStreet: req.addressStreet || null,
    addressNumber: req.addressNumber || null
  }
  for (var field in userData) {
    if (typeof (userData[field]) === 'undefined') throw (`${field} is undefined`)
  }
  return userData
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  admin.auth().listUsers().then((users) => {
    res.end(JSON.stringify(users.users, null, '\t'));
  }).catch((error) => console.log(error));
});

router.post('/register', (req, res, next) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((registeredUser) => {
      if (registeredUser.user) {
        try {
          let userData = getUserDataFromRequest(req.body)
          dbActions.writeToCollection(Constants.Collections.USERS_DETAILS, registeredUser.user.uid, userData)
          registeredUser.user.sendEmailVerification()
            .then(() => {
              console.log('Verification email sent to ' + registeredUser.user.email)
            }).catch((error) => {
              sendError(res, error)
              return;
            });
        } catch (error) {
          registeredUser.user.delete()
            .then(() => {
              console.log(`User ${req.body.email} has been deleted successfully`)
            }).catch(() => {
              console.error(`Error deleting ${req.body.email}`)
            })
          sendError(res, `User ${req.body.email} was not registered. User data writing error.\n${error}`)
          console.error(`couldent register ${req.body.email}\n${error}`)
          return;
        }
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
          res.send(idToken)
          res.end()
        }).catch((error) => {
          sendError(res, error)
        });
      }
    }).catch((error) => {
      sendError(res, error)
      //Handle error
    });
})

router.post('/login', (req, res, next) => {
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(() => {
      firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
        res.send(idToken)
        res.end()
      }).catch((error) => {
        sendError(res, error)
      });
    }).catch((error) => {
      sendError(res, error)
      //Handle error
    });
})

router.get('/logout', (req, res, next) => {
  firebase.auth().signOut().then(() => {
    res.send('Signed Out')
    res.end()
  }).catch((error) => {
    sendError(res, error)
  });
})

router.post('/updateProfile', (req, res, next) => {
  let userId = firebase.auth().currentUser.uid;
  dbActions.updateDocument(Constants.Collections.USERS_DETAILS, userId, req.body)
    .then((success) => {
      if (success) {
        res.send(userId + ' Profile updated successfully')
        res.end()
      }
      else {
        sendError(res, 'Error updating profile for ' + userId)
      }
    })
})

router.post('/resetPassword', (req, res, next) => {
  let email = req.body.email
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      console.log('Reset password sent to ' + email)
      res.send('Reset Password sent to ' + email)
      res.end()
    }).catch((error) => {
      sendError(res, error)
    });
})

router.get('/:userId', (req, res, next) => {
  dbActions.getDocument(Constants.Collections.USERS_DETAILS, req.params.userId)
    .then((doc) => {
      if (!doc) {
        res.send(`No user details document found for ${req.params.userId}`)
        res.end()
      } else {
        res.send(JSON.stringify(doc, null, '\t'))
        res.end()
      }
    })
})

router.get('/:userId/storage', (req, res, next) => {
  dbActions.getDocument(Constants.Collections.USER_STORAGE, req.params.userId)
    .then((doc) => {
      if (!doc) {
        res.send(`No document found for ${req.params.userId}`)
        res.end()
      } else {
        res.send(JSON.stringify(doc, null, '\t'))
        res.end()
      }
    })
})

module.exports = router;
