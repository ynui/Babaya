const { AreaOfInterest, SubAreaOfInterest } = require('./AreaOfInterest')

const COLLECTION_AREAS_OF_INTERESTS = 'areasOfInterest';
const COLLECTION_SUB_AREAS_OF_INTERESTS = 'areasOfInterestSub';

async function createAreaOfInterest(data) {
    let newAreaOfInterest = null
    try {
        newAreaOfInterest = new AreaOfInterest(data)
    } catch (error) {
        throw error
    }
    return newAreaOfInterest
}

async function createSubAreaOfInterest(data) {
    let newSubAreaOfInterest = null
    try {
        newSubAreaOfInterest = new SubAreaOfInterest(data)
    } catch (error) {
        throw error
    }
    return newSubAreaOfInterest
}

module.exports = {
    createAreaOfInterest,
    createSubAreaOfInterest
}