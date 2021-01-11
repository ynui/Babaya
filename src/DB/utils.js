const { firebase, admin, Constants } = require('../../firebase/fbConfig');
require('firebase/storage');


const db = admin.firestore()
const storage = firebase.storage()

async function uploadImage(files, id) {
    let resURL = {};
    let storageRef = storage.ref(id);
    for (const [key, file] of Object.entries(files)) {
        await storageRef.child(file.name).put(file.data)
            .then(async (task) => {
                await task.ref.getDownloadURL()
                    .then((res) => {
                        console.log(`File uploaded: ${file.name}`)
                        resURL[file.name] = res
                    })
            })
            .catch((err) => {
                console.error(`Error Uploading: ${file.name} ${err}`)
                resURL[file.name] = 'Error'
            })
    }
    writeToCollection(Constants.Collections.USER_STORAGE, id, resURL)
    return resURL
}


async function writeToCollectionU(collection, data) {
    let doc = null
    try {
        await db.collection(collection).add(data)
            .then((docRef) => {
                if (docRef) {
                    doc = docRef
                }else{
                    //TODO
                }
            })
    } catch (error) {
        console.error(`${error}\n collection: ${collection} data: ${data}`)
        throw error
    }
    return doc
}


async function writeToCollection(collection, document, data) {
    try {
        await db.collection(collection).doc(document).set(data)
    } catch (error) {
        console.error(`${error}\n collection: ${collection} doc: ${document} data: ${data}`)
        throw error
    }
    return true
}

async function updateDocument(collection, document, data) {
    try {
        await db.collection(collection).doc(document).update(data)
    } catch(error){
        console.error('Error updating ' + collection + document + data)
        throw error
    }
    return true
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

// function registerUser(email, password) {
//   firebase.auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then((user) => {
//       user.user.sendEmailVerification()
//         .then(() => {
//           console.log('Verification email sent to ' + user.user.email)
//         }).catch((error) => {
//           console.log('Error sending verification email ' + user.user.email)
//           return;
//         });
//       return user.user
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       throw error
//     });
// }

module.exports = {
    writeToCollection,
    writeToCollectionU,
    updateDocument,
    getDocument,
    uploadImage,
    //   registerUser,
    getCollection
};