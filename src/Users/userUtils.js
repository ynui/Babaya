const { firebase, admin } = require('../../firebase/fbConfig');
const DB_Utils = require('../DB/utils')
const User = require('./User')
const Utils = require('../Utils')
const Translator = require('../Translateor/translator')

const COLLECTION_USERS_DETAILS = 'usersDetails';

async function registerUser(data) {
    let newUser = null;
    try {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then((user) => {
                let registeredUser = user.user
                data.userId = registeredUser.uid
                newUser = new User(data)
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return newUser
}

async function wriewUserDetails(user) {
    let success = false
    try {
        success = await DB_Utils.writeToCollection(COLLECTION_USERS_DETAILS, user.userId, user.data)
    } catch (error) {
        deleteUser(user.userId)
        throw error
    }
    return success
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
                throw Utils.createError(`Error getting token ${newUser.email}, ${error}`, 'cant-get-token')
            });
    } catch (error) {
        throw error
    }
    return token
}

async function login(email, password) {
    let token = null;
    let user = null;
    try {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (registeredUser) => {
                await registeredUser.user.getIdToken(true)
                    .then(async (idToken) => {
                        token = idToken
                        user = await getUser(registeredUser.user.uid)
                    }).catch((error) => {
                        throw error
                    });
            }).catch((error) => {
                throw error
            });
    } catch (error) {
        throw error
    }
    return {
        user: user,
        token: token
    }
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

async function updateProfile(userId, data) {
    let success = false;
    try {
        let user = await getUser(userId)
        if (user) {
            await DB_Utils.updateDocument(COLLECTION_USERS_DETAILS, user.userId, data)
                .then((resault) => {
                    if (resault) success = true
                }).catch((error) => {
                    throw error
                })
        }
        else {
            throw error
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
                throw Utils.createError(`No user details document found for ${userId}`, 'no-user-found')
            }
        })
    return user
}

async function getReadableUser(userId, langId = 'eng') {
    let user = null;
    await DB_Utils.getDocument(COLLECTION_USERS_DETAILS, userId)
        .then((found) => {
            if (found) {
                let translatedFields = translateFields(found, langId)
                for (var field in translatedFields) {
                    if (found[field])
                        found[field] = translatedFields[field].value
                }
                user = new User(found)
            } else {
                throw Utils.createError(`No user details document found for ${userId}`, 'no-user-found')
            }
        })
    return {
        langId,
        user
    }
}

function translateFields(user, langId) {
    let resault = {
        genderId: Translator.getItem('gender', user.genderId, langId) || null,
        workingPlace: Translator.getItem('workingPlace', user.workingPlace, langId) || null,
        expertise: Translator.getItem('expertise', user.expertise, langId) || null,
        areaOfInterest: Translator.getItem('areaOfInterest', user.areaOfInterest, langId) || null,
        demographic: Translator.getItem('demographic', user.demographic, langId) || null
    }
    return resault
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
        user.addToGroupsList(groupId)
        let updateUser = await updateProfile(userId, { groups: user.groups })
    } catch (error) {
        throw error
    }
    return user
}

async function removeGroup(userId, groupId) {
    let user = null
    try {
        user = await getUser(userId)
        user.removeFromGroupsList(groupId)
        let updateUser = await updateProfile(userId, { groups: user.groups })
    } catch (error) {
        throw error
    }
    return user
}

async function resetPassword(email) {
    let success = false;
    try {
        await firebase
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

function validateRequest(req, res, next, required = [], optional = []) {
    let originalUrl = Utils.removeTrailingSlash(req.originalUrl)
    let url = Utils.removeTrailingSlash(req.url)
    req.valid = false
    switch (url) {
        case '/register':
            required = User.RequestValidators.register.required
            optional = User.RequestValidators.register.optional
            break;
        case '/update':
            required = User.RequestValidators.update.required
            optional = User.RequestValidators.update.optional
            break;
        case '/login':
            required = User.RequestValidators.login.required
            optional = User.RequestValidators.login.optional
            break;
        case '/addGroup':
            required = User.RequestValidators.addGroup.required
            optional = User.RequestValidators.addGroup.optional
            break;
        case '/resetPassword':
            required = User.RequestValidators.resetPassword.required
            optional = User.RequestValidators.resetPassword.optional
            break;
        case '/removeGroup':
            required = User.RequestValidators.removeGroup.required
            optional = User.RequestValidators.removeGroup.optional
            break;
        default:
            let isCustom = false
            if (req.customURL) {
                isCustom = true
                switch (req.customURL) {
                    case ':userId':
                        required = User.RequestValidators.getUser.required
                        optional = User.RequestValidators.getUser.optional
                        break;
                    default:
                        if (required.length == 0 && optional.length == 0) {
                            console.warn(`No validators provided for ${originalUrl}/(${req.customURL})`)
                        }
                        break;
                }
            }
            else {
                if (required.length == 0 && optional.length == 0) {
                    console.warn(`No validators provided for ${originalUrl}`)
                }
            }
            break;
    }
    let validateResault = Utils.validateRequest(req, required, optional);
    if (validateResault.error) return next(validateResault.error)
    else req.valid = validateResault.valid
    return next()
}

function getValidator(validateUrl) {
    let required = User.RequestValidators[validateUrl].required
    let optional = User.RequestValidators[validateUrl].optional
    return {
        required: required,
        optional: optional
    }
}

function sendVerificationEmail() {
    var user = firebase.auth().currentUser;
    try {
        user.sendEmailVerification()
            .then(() => {
                console.log('Verification email sent to ' + user.email)
            }).catch((error) => {
                throw error
            });
    }
    catch (error) {
        throw error
    }
}

async function deleteUser(userId) {
    try {
        await admin
            .auth()
            .deleteUser(userId)
            .then(() => {
                console.log('Successfully deleted user');
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
            });
        await DB_Utils.deleteDocument(COLLECTION_USERS_DETAILS, userId)
    } catch (error) {
        throw error
    }
}

async function deleteAllUsers() {
    await getAllUsers()
        .then(async (all) => {
            for (user of all.users) {
                await deleteUser(user.uid)
                    .then(() => {
                        console.log(`Successfully deleted user ${user.uid}`);
                    })
                    .catch((error) => {
                        console.log('Error deleting user:', error);
                    });
            }

        })
}

module.exports = {
    sendVerificationEmail,
    validateRequest,
    registerUser,
    wriewUserDetails,
    getToken,
    login,
    logout,
    updateProfile,
    getReadableUser,
    getAllUsers,
    getAllUsersDetails,
    addGroup,
    resetPassword,
    removeGroup,
    deleteAllUsers,
    getValidator
}