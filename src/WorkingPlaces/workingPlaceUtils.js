const { WorkingPlace, workingPlaceDepartment } = require('./WorkingPlace')

const COLLECTION_WORKING_PLACES = 'workingPlaces';
const COLLECTION_WORKING_PLACES_DEPARTMENTS = 'workingPlacesDepartments';

async function createWorkingPlace(data) {
    let newWorkingPlace = null
    try {
        newWorkingPlace = new WorkingPlace(data)
    } catch (error) {
        throw error
    }
    return newWorkingPlace
}

async function createWorkingPlaceDepartment(data) {
    let newWorkingPlaceDepartment = null
    try {
        newWorkingPlaceDepartment = new workingPlaceDepartment(data)
    } catch (error) {
        throw error
    }
    return newWorkingPlaceDepartment
}

module.exports = {
    createWorkingPlace,
    createWorkingPlaceDepartment
}