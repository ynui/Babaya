const { firebase, admin } = require('../../firebase/fbConfig');
const DB_Utils = require('../DB/utils')
const User = require('./User')

const COLLECTION_USERS_DETAILS = 'usersDetails';


async function registerUser(data) {
    let newUser = null;
    try {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then((user) => {
                let registeredUser = user.user
                data.uid = registeredUser.uid
                newUser = new User(data)
                registeredUser.sendEmailVerification()
                    .then(() => {
                        console.log('Verification email sent to ' + registeredUser.email)
                    }).catch((error) => {
                        throw error
                    });
            }).catch((error) => {
                console.log(error)
                throw error
            })
    } catch (error) {
        console.log(error)
        throw error
    }
    return newUser
}

async function wriewUserDetails(user) {
    let userData = user.data
    for (var field in userData) {
        if (typeof (userData[field]) === 'undefined') throw (`${field} is undefined`)
    }
    try {
        DB_Utils.writeToCollection(COLLECTION_USERS_DETAILS, user.uid, user.data)
    } catch (error) {
        user.user.delete()
            .then(() => {
                console.log(`User ${user.email} has been deleted successfully`)
            }).catch(() => {
                throw (`Error deleting ${user.email}\n${error}`)
            })
        throw (`couldent write data to ${user.email}\n${error}`)
    }
    return userData
}

async function getToken() {
    let token = null;
    try {
        await firebase
            .auth()
            .currentUser
            .getIdToken(true)
            .then((idToken) => {
                token = idToken
            }).catch((error) => {
                throw (`Error getting token ${newUser.email}, ${error}`)
            });
    } catch (error) {
        throw error
    }
    return token
}

async function login(email, password) {
    let token = null;
    try {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (user) => {
                await user.user.getIdToken(true).then((idToken) => {
                    token = idToken
                }).catch((error) => {
                    throw error
                });
            }).catch((error) => {
                throw error
            });
    } catch (error) {
        throw error
    }
    return token
}

async function logout() {
    let success = false
    try {
        await firebase
            .auth()
            .signOut()
            .then(() => {
                success = true
            }).catch((error) => {
                throw error
            });
    } catch (error) {
        throw error
    }
    return success
}

async function updateProfile(data) {
    let success = false;
    try {
        let user = await firebase.auth().currentUser;
        if (user) {
            await DB_Utils.updateDocument(COLLECTION_USERS_DETAILS, user.uid, data)
                .then((resault) => {
                    if (resault) success = true
                }).catch((error) => {
                    throw error
                })
        }
        else {
            throw 'User is not signed in!'
        }
    } catch (error) {
        throw error
    }
    return success
}

async function getUser(userId) {
    let user = null;
    await DB_Utils.getDocument(COLLECTION_USERS_DETAILS, userId)
        .then((found) => {
            if (found) {
                user = new User(found)
            } else {
                throw `No user details document found for ${userId}`
            }
        })
    return user
}

async function getAllUsers() {
    let users = null
    await admin
        .auth()
        .listUsers()
        .then((res) => {
            users = res
        }).catch((error) => { throw error });
    return users
}

async function getAllUsersDetails() {
    let users = null;
    await DB_Utils.getCollection(COLLECTION_USERS_DETAILS)
        .then((found) => {
            if (found) {
                users = found
            } else {
                users = []
            }
        })
    return users
}

async function addGroup(userId, groupId) {
    let user = null
    try {
        user = await getUser(userId)
        if (user.groups.includes(groupId)) throw `${userId} is already in group ${groupId}`
        user.groups.push(groupId)
        let updateUser = await updateProfile({ groups: user.groups })
    } catch (error) {
        throw error
    }
    return user
}

async function resetPassword(email) {
    let success = false;
    try {
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                success = true
            }).catch((error) => {
                throw error
            });
    } catch (error) {
        throw error
    }
    return success
}

async function deleteAllUsers() {

}

module.exports = {
    registerUser,
    wriewUserDetails,
    getToken,
    login,
    logout,
    updateProfile,
    getUser,
    getAllUsers,
    getAllUsersDetails,
    addGroup,
    resetPassword,
    deleteAllUsers
}