require('firebase/auth');
const firebase = require('firebase')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey');

const CONSTANTS = {
    COLLECTION_USERS_DETAILS: 'usersDetails'
}


const firebaseConfig = {
    apiKey: "AIzaSyDVutOMeWFD2jN9aeWlND6AFL-ZqH0cqew",
    authDomain: "ynui-c7cf0.firebaseapp.com",
    projectId: "ynui-c7cf0",
    storageBucket: "ynui-c7cf0.appspot.com",
    messagingSenderId: "65475313693",
    appId: "1:65475313693:web:819fbd6d2aca7d36b846f4",
    measurementId: "G-RG26Z4B1LW"
};

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ynui-c7cf0-default-rtdb.firebaseio.com/"
});

module.exports = { firebase, admin, CONSTANTS };