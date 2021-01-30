const Group = require('./Group')
const DB_Utils = require('../DB/dbUtils')
const Utils = require('../Utils');
const userUtils = require('../Users/userUtils')

const COLLECTION_GROUPS = 'groups';

async function createGroup(data, createUser = null) {
    if (createUser) {
        data.createUser = createUser
    }
    let newGroup = null
    try {
        newGroup = new Group(data)
    } catch (error) {
        throw error
    }
    return newGroup
}

async function getGroup(groupId) {
    let group = null;
    await DB_Utils.getDocument(COLLECTION_GROUPS, groupId)
        .then((found) => {
            if (found) {
                group = new Group(found)
            } else {
                throw Utils.createError(`No group details document found for ${groupId}`, 'no-group-found')
            }
        })
    return group
}

async function getAllUserGroups(userId) {
    let groups = null;
    try {
        let user = await userUtils.getUser(userId)
        let groupIds = user.groups
        //readable?
        groups = groupIds
    } catch (error) {
        throw error
    }
    return groups
}

async function getAllGroups() {
    let groups = null;
    await DB_Utils.getCollection(COLLECTION_GROUPS)
        .then((found) => {
            if (found) {
                groups = found
            } else {
                groups = []
            }
        })
    return groups
}

async function writeGroupDetails(group) {
    let success = false;
    try {
        await DB_Utils.writeToCollection(COLLECTION_GROUPS, group.groupId, group.data)
            .then((doc) => {
                success = true
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return success
}

async function addUser(groupId, userId) {
    let group = null
    try {
        group = await getGroup(groupId)
        if (group.users.includes(userId)) throw Utils.createError(`${groupId} already has user ${userId}`, 'group-already-contains-user')
        group.users.push(userId)
        let updatedGroup = await updateGroup(group, { users: group.users })
    } catch (error) {
        throw error
    }
    return group
}

async function removeUser(groupId, userId) {
    let group = null
    try {
        group = await getGroup(groupId)
        group.removeFromUsersList(userId)
        let updatedGroup = await updateGroup(groupId, { users: group.users })
    } catch (error) {
        throw error
    }
    return group
}

async function updateGroup(groupId, data) {
    let success = false;
    try {
        await DB_Utils.updateDocument(COLLECTION_GROUPS, groupId, data)
            .then((resault) => {
                if (resault) success = true
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return success
}

async function addUser(groupId, userId) {
    let group = null
    try {
        group = await getGroup(groupId)
        group.addToUsersList(userId)
        let updatedGroup = await updateGroup(group.groupId, { users: group.users })
    } catch (error) {
        throw error
    }
    return group
}

function validateRequest(req, res, next, required = [], optional = []) {
    let originalUrl = Utils.removeTrailingSlash(req.originalUrl)
    let url = Utils.removeTrailingSlash(req.url)
    req.valid = false
    switch (url) {
        case '/create':
            required = Group.RequestValidators.create.required
            optional = Group.RequestValidators.create.optional
            break;
        case '/update':
            required = Group.RequestValidators.update.required
            optional = Group.RequestValidators.update.optional
            break;
        case '/removeUser':
            required = Group.RequestValidators.removeUser.required
            optional = Group.RequestValidators.removeUser.optional
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

async function deleteGroup(groupId) {
    let success = false;
    try {
        await DB_Utils.deleteDocument(COLLECTION_GROUPS, groupId)
            .then((doc) => {
                success = true
            }).catch((error) => {
                throw error
            })
    } catch (error) {
        throw error
    }
    return success
}


module.exports = {
    createGroup,
    getGroup,
    writeGroupDetails,
    getAllGroups,
    addUser,
    updateGroup,
    validateRequest,
    removeUser,
    deleteGroup,
    getAllUserGroups
}