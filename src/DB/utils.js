const { firebase, admin, Constants } = require('../../firebase/fbConfig');
require('firebase/storage');
const Utils = require('../Utils')

const db = admin.firestore()
const storage = firebase.storage()

// async function uploadImage(files, id) {
//     let resURL = {};
//     let storageRef = storage.ref(id);
//     for (const [key, file] of Object.entries(files)) {
//         await storageRef.child(file.name).put(file.data)
//             .then(async (task) => {
//                 await task.ref.getDownloadURL()
//                     .then((res) => {
//                         console.log(`File uploaded: ${file.name}`)
//                         resURL[file.name] = res
//                     })
//             })
//             .catch((err) => {
//                 console.error(`Error Uploading: ${file.name} ${err}`)
//                 resURL[file.name] = 'Error'
//             })
//     }
//     writeToCollection(Constants.Collections.USER_STORAGE, id, resURL)
//     return resURL
// }


async function writeToCollection(collection, document, data) {
    let success = false
    try {
        Utils.validateDataWrite(data)
        await db.collection(collection).doc(document).set(data)
        success = true
    } catch (error) {
        console.error(`${error}\n collection: ${collection} doc: ${document} data: ${data}`)
        throw error
    }
    return success
}

async function updateDocument(collection, document, data) {
    let success = false
    try {
        Utils.validateDataWrite(data)
        await db.collection(collection).doc(document).update(data)
        success = true
    } catch (error) {
        console.error('Error updating ' + collection + document + data)
        throw error
    }
    return success
}

async function getDocument(collection, document) {
    let resault = null
    let docRef = db.collection(collection).doc(document)
    let doc = await docRef.get()
    if (doc.exists) resault = doc.data()
    return resault
}


async function getCollection(collection) {
    let resault = null
    try {
        let colRef = db.collection(collection)
        let col = await colRef.get()
        resault = col.docs.map(doc => doc.data())
    } catch (error) {
        throw error
    }
    return resault
}

module.exports = {
    writeToCollection,
    updateDocument,
    getDocument,
    // uploadImage,
    getCollection
};