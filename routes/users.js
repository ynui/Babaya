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
    res.end(JSON.stringify(users.users));
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
        let userDataWriteSuccess = dbActions.writeToCollection(CONSTANTS.COLLECTION_USERS_DETAILS, req.body.email, userData)
        if (!userDataWriteSuccess) {
          sendError(res, 'Error writing data to ' + req.body.email)
        }
        registeredUser.user.sendEmailVerification()
          .then(() => {
            console.log('Verivication email sent to ' + registeredUser.user.email)
          }).catch((error) => {
            sendError(res, error)
          });
      }
      // else{
      //   sendError(res, 'User registration failed for ' + req.body.email)
      // }
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
  }).catch(function (error) {
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

      }).catch(function (error) {
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

module.exports = router;
