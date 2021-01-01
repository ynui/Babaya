const { firebase, admin } = require('./fbConfig');



db = admin.firestore()

function writeToCollection(collection, document, data) {
  try {
    db.collection(collection).doc(document).set(data)
  } catch (error) {
    console.error(`Error: ${error}\n collection: ${collection} doc: ${document} data: ${data}`)
    throw error
  }
  return true
}

function updateDocument(collection, document, data) {
  try {
    db.collection(collection).doc(document).update(data)
  } catch {
    console.error('Error updating ' + collection + document + data)
    return false
  }
  return true
}

module.exports = {
  writeToCollection,
  updateDocument
};