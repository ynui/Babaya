const { firebase, admin } = require('../../firebase/fbConfig');
const DB_Utils = require('../DB/dbUtils')
const User = require('./User')
const Demographic = require('../Demographics/Demographic')
const Utils = require('../Utils')
const demographicUtils = require('../Demographics/demographicUtils')
const Translator = require('../Translateor/translator')

const COLLECTION_USERS_DETAILS = 'usersDetails';

async function registerUser(data) {
    let newUser = null;
    let userId = null
    try {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password)
            .then(async (user) => {
                let registeredUser = user.user
                userId = registeredUser.uid
                data.userId = userId
                data = await generateObjects(data)
                newUser = new User(data)
            }).catch((error) => {
                throw error
            })
        // addUserToObjectLists(newUser)
    } catch (error) {
        throw error
    }
    return newUser
}

async function generateObjects(data) {
    let demographic = null
    try {
        if (data.demographic) {
            demographic = await demographicUtils.createDemographic(data.demographic, data.userId)
            data.demographic = demographic.demographicId
        }
    } catch (error) {
        console.error(error)
        data.demographic = null
    }
    return data
}

async function addUserToObjectLists(user) {
    let success = false
    try {
        await demographicUtils.addUser(user.demographic, user.userId)
        success = true
    } catch (error) {
        throw error
    }
    return success
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

async function getReadableUser(userId, langId = '1') {
    let user = null;
    await DB_Utils.getDocument(COLLECTION_USERS_DETAILS, userId)
        .then(async (found) => {
            if (found) {
                let translatedFields = await translateFields(found, langId)
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

async function translateFields(user, langId) {
    let resault = null
    let readableDemographic = null
    try {
        if (user.demographic) {
            let demographic = await getDemographic(user.demographic)
            readableDemographic = await Translator.getReadableDemographic(demographic, langId)
        }
        resault = {
            genderId: Translator.getItem('gender', user.genderId, langId) || null,
            workingPlace: Translator.getItem('workingPlace', user.workingPlace, langId) || null,
            expertise: Translator.getItem('expertise', user.expertise, langId) || null,
            areaOfInterest: Translator.getItem('areaOfInterest', user.areaOfInterest, langId) || null,
            demographic: readableDemographic || null
        }
    } catch (error) {
        throw error
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

async function getDemographic(demographicId) {
    let demographic = null
    try {
        demographic = await demographicUtils.getDemographic(demographicId)
    } catch (error) {
        throw error
    }
    return demographic
}

async function addDemographic(userId, data) {
    let demographic = null
    let user = null
    try {
        demographic = await demographicUtils.createDemographic(data, userId)
        user = await getUser(userId)
        if (user.demographic !== null) {
            await demographicUtils.removeUser(user.demographic, userId)
            user.removeDemographic()
        }
        user.setDemographic(demographic.demographicId)
        let updateUser = await updateProfile(userId, { demographic: user.demographic })
    } catch (error) {
        throw error
    }
    return user
}

async function removeDemographic(userId, groupId) {
    let success = false
    let user = null
    try {
        user = await getUser(userId)
        await demographicUtils.removeUser(user.demographic, userId)
        user.removeDemographic(groupId)
        let updateUser = await updateProfile(userId, { demographic: user.demographic })
        success = true
    } catch (error) {
        throw error
    }
    return success
}

async function addDemographicOther(userId, data) {
    let demographic = null
    let user = null
    try {
        demographic = demographicUtils.createDemographic(data)
        user = await getUser(userId)
        user.addDemographicOther(demographic.demographicId)
        let updateUser = await updateProfile(userId, { demogrephicsOther: user.demographic })
    } catch (error) {
        throw error
    }
    return user
}

async function removeDemographicOther(userId, demographicId) {
    let user = null
    try {
        user = await getUser(userId)
        user.removeDemographicOther(demographicId)
        let updateUser = await updateProfile(userId, { demogrephicsOther: user.demogrephicsOther })
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
    let url = req.customURL || Utils.removeTrailingSlash(req.url)
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
        case '/getUserLang':
            required = User.RequestValidators.getUser.required
            optional = User.RequestValidators.getUser.optional
            break;
        case '/createDemographic':
            required = Demographic.RequestValidators.create.required
            optional = Demographic.RequestValidators.create.optional
            break;
        case '/updateDemographic':
            required = Demographic.RequestValidators.update.required
            optional = Demographic.RequestValidators.update.optional
            break;
        default:
            if (required.length == 0 && optional.length == 0) {
                console.warn(`No validators provided for ${originalUrl}`)
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

function updateDeletedGroupForUsers(groupId) {

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

async function deleteAllUsers(seriously) {
    if (seriously) {
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
    else {
        return 'Your\'e not serious....'
    }
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
    getValidator,
    getDemographic,
    addDemographic,
    removeDemographic,
    addDemographicOther,
    removeDemographicOther,
    getUser
}