const { firebase, admin } = require('./fbConfig');



db = admin.firestore()

function writeToCollection(collection, document, data) {
  res = {}
  try {
    db.collection(collection).doc(document).set(data)
  } catch (error) {
    console.log('Error writing data ' + collection + document + data)
    return false
  }
  return true
}

function updateDocument(collection, document, data) {
  try {
    db.collection(collection).doc(document).update(data)
  } catch {
    console.log('Error updating ' + collection + document + data)
    return false
  }
  return true
}

module.exports = {
  writeToCollection,
  updateDocument
};