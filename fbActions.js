const { firebase, admin } = require('./fbConfig');
require('firebase/storage');


const db = admin.firestore()
const bucket = admin.storage().bucket('aaa')

async function uploadImage(files, id) {
  let resURL = {};
  var storageRef = firebase.storage().ref(id);
  for (const [key, file] of Object.entries(files)) {
    await storageRef.child(file.name).put(file.data)
      .then(async (task) => {
        console.log('uploaded')
        await task.ref.getDownloadURL()
          .then((res) => {
            resURL[file.name] = res
          })
      })
      .catch((err) => {
        console.log(err)
        resURL[file.name] = 'Error'
      })
  }
  return resURL
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
  } catch {
    console.error('Error updating ' + collection + document + data)
    return false
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

module.exports = {
  writeToCollection,
  updateDocument,
  getDocument,
  uploadImage
};