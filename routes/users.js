const e = require('express');
const express = require('express');
const router = express.Router();
const { firebase, admin, CONSTANTS } = require('../fbConfig')
const dbActions = require('../fbActions')

db = admin.firestore()


function sendError(res, error) {
  res.send(error)
  res.end()
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  admin.auth().listUsers().then((users) => {
    res.end(JSON.stringify(users.users, null, '\t'));
  }).catch((error) => console.log(error));
});

router.post('/register', (req, res, next) => {
  firebase.auth()
    .createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((registeredUser) => {
      if (registeredUser.user) {
        let userData = {
          phoneNumber: req.body.phoneNumber,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          language: req.body.language,
          accountType: req.body.accountType,
          gender: req.body.gender || null,
          addressCity: req.body.addressCity || null,
          addressStreet: req.body.addressStreet || null,
          addressNumber: req.body.addressNumber || null
        }
        try {
          dbActions.writeToCollection(CONSTANTS.COLLECTION_USERS_DETAILS, req.body.email, userData)
          registeredUser.user.sendEmailVerification()
            .then(() => {
              console.log('Verification email sent to ' + registeredUser.user.email)
            }).catch((error) => {
              sendError(res, error)
              return;
            });
        }
        catch (error) {
          registeredUser.user.delete()
            .then(() => {
              console.log(`User ${req.body.email} has been deleted successfully`)
            }).catch(() => {
              console.error(`Error deleting ${req.body.email}`)
            })
          sendError(res, `User ${req.body.email} was not registered. User data writing error.\${error}`)
          console.error(`couldent register ${req.body.email}\nError: ${error.message}`)
          return;
        }
      }
      firebase.auth().currentUser.getIdToken(true).then((idToken) => {
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

router.get('/facebookLogin', (req, res, next) => {
  console.log('FBFBFB')
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(token)
      console.log(user)
      firebase.auth().currentUser.getIdToken(true).then((idToken) => {
        res.send(idToken)
        res.end()

      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
    })
})

router.post('/updateProfile', (req, res, next) => {
  let email = firebase.auth().currentUser.email;
  let updateProfileSuccess = dbActions.updateDocument(CONSTANTS.COLLECTION_USERS_DETAILS, email, req.body);
  if (updateProfileSuccess) {
    res.send(email + ' Profile updated successfully')
    res.end()
  }
  else {
    sendError(res, 'Error updating profile for ' + email)
  }
})

router.post('/resetPassword', (req, res, next) => {
  let email = req.body.email
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      console.log('Reset password sent to ' + email)
      res.send('Reset Password sent to ' + email)
      res.end()
    }).catch((error) => {
      sendError(res, error)
    });
})

router.get('/:userId', (req, res, next) => {
  let doc = dbActions.getDocument(CONSTANTS.COLLECTION_USERS_DETAILS, req.body.userId)
  if (!doc) {
    res.send(`No document found for ${req.body.userId}`)
    res.end()
  } else {
    res.send(doc.data())
    res.end()
  }
})

module.exports = router;
