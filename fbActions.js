const { firebase, admin } = require('./fbConfig');


db = admin.firestore()


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
  getDocument
};