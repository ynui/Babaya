const { Expertise, SubExpertise } = require('./Expertise')

const COLLECTION_EXPERTIESES = 'expertises';
const COLLECTION_SUB_EXPERTIESES = 'expertisesSub';

async function createExpertise(data) {
    let newExpertise = null
    try {
        newExpertise = new Expertise(data)
    } catch (error) {
        throw error
    }
    return newExpertise
}

async function createSubExpertise(data) {
    let newSubExpertise = null
    try {
        newSubExpertise = new SubExpertise(data)
    } catch (error) {
        throw error
    }
    return newSubExpertise
}

module.exports = {
    createExpertise,
    createSubExpertise
}