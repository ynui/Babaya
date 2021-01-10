const { Country, County, City, Street } = require('./Demographic')

const COLLECTION_COUNTRIES = 'demographicCountries';
const COLLECTION_COUNTIES = 'demographicCounties';
const COLLECTION_CITIES = 'demographicCities';
const COLLECTION_STREETS = 'demographicStreets';

async function createCountry(data) {
    let newCountry = null
    try {
        newCountry = new Country(data)
    } catch (error) {
        throw error
    }
    return newCountry
}

async function createCounty(data) {
    let newCounty = null
    try {
        newCounty = new County(data)
    } catch (error) {
        throw error
    }
    return newCounty
}

async function createCity(data) {
    let newCity = null
    try {
        newCity = new City(data)
    } catch (error) {
        throw error
    }
    return newCity
}

async function createStreet(data) {
    let newStreet = null
    try {
        newStreet = new Street(data)
    } catch (error) {
        throw error
    }
    return newStreet
}

module.exports = {
    createCountry,
    createCounty,
    createCity,
    createStreet
}