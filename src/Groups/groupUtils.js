const { firebase, admin } = require('../../firebase/fbConfig');
const DB_Utils = require('../DB/utils')
const Group = require('./Group')

const COLLECTION_GROUPS = 'groups';

async function createGroup(data) {
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
                throw `No group details document found for ${groupId}`
            }
        })
    return group
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
    let resault = null;
    let data = group.data;
    try {
        if (group.groupId) await DB_Utils.writeToCollection(COLLECTION_GROUPS, uid, group.data)
        else {
            let writeToDB = await DB_Utils.writeToCollectionU(COLLECTION_GROUPS, group.data)
                .then(async (doc) => {
                    data.groupId = doc.id
                    await doc.update({
                        groupId: doc.id
                    })
                    resault = new Group(data)
                }).catch((error) => {
                    throw error
                })
        }
    } catch (error) {
        throw error
    }
    return resault
}

async function addUser(groupId, userId) {
    let group = null
    try {
        group = await getGroup(groupId)
        if (group.users.includes(userId)) throw `${groupId} already has user ${userId}`
        group.users.push(userId)
        let updateGroup = await updateGroup(group, { users: group.users })
    } catch (error) {
        throw error
    }
    return group
}

async function updateGroup(group, data) {
    let success = false;
    try {
        await DB_Utils.updateDocument(COLLECTION_GROUPS, group.groupId, data)
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
        if (group.users.includes(userId)) throw `${groupId} already has user ${userId}`
        group.users.push(userId)
        let updatedGroup = await updateGroup(group, { users: group.users })
    } catch (error) {
        throw error
    }
    return group
}

module.exports = {
    createGroup,
    getGroup,
    writeGroupDetails,
    getAllGroups,
    addUser,
    updateGroup
}