const Utils = require('../Utils')
// const demographicUtils = require('../Demographics/demographicUtils')
const addresses = require('./Addresses')
const areasOfInterest = require('./AreasOfInterest')
const cities = require('./Cities')
const counties = require('./Counties')
const countries = require('./Countries')
const departments = require('./Departments')
const expertises = require('./Expertises')
const genders = require('./Genders')
const languages = require('./Languages')
const rules = require('./Rules')
const streets = require('./Streets')
const userTypes = require('./UserTypes')
const workingPlaces = require('./WorkingPlaces')


function getTranslatorSupportFields() {
    let dictionaries = getSupportedDictionaries();
    let languages = getSupportedLanguages();
    return {
        dictionaries,
        languages
    }
}


function getSupportedLanguages() {
    return [
        {
            'Name': 'English',
            'ID': 1
        },
        {
            'Name': 'Hebrew',
            'ID': 2
        }
    ]
}

function getSupportedDictionaries() {
    return [
        'address', 'areaOfInterest', 'city', 'county', 'country', 'department', 'expertise', 'gender', 'language', 'rule', 'street', 'userTypes', 'workingPlace'
    ]
}

function getItem(dictionary, query, langId = '1') {
    let resault = null
    if (query) {
        langId = langId.toString()
        if (Array.isArray(query))
            resault = getManyItems(dictionary, query, langId)
        else
            resault = getSingleItem(dictionary, query, langId)
    }
    return resault
}

function getSingleItem(dictionary, query, langId = '1') {
    let resault = { langId: null, itemId: null, value: null }
    query = query.toString()
    if (query.match(/^-?\d+$/))
        resault = getSingleItemById(dictionary, query, langId)
    // else
    //     resault = getSingleItemByName(dictionary, query, langId)
    return {
        langId: langId,
        itemId: query,
        value: resault.value
    }
}

function getManyItems(dictionary, queryArray, langId = '1') {
    let resault = []
    for (var query of queryArray) {
        resault.push(getSingleItem(dictionary, query, langId).value)
    }
    return {
        langId: langId,
        itemId: queryArray,
        value: resault
    }
}

// function getSingleItemByName(dictionary, query, langId) {
//     let resault = null
//     let dict = getDictionary(dictionary)
//     switch (langId) {
//         case '1':
//             resault = dict.find(item => item.eng_name.match(new RegExp(query, 'gi')))
//             break;
//         case '2':
//             resault = dict.find(item => item.heb_name === query)
//             break;
//         default:
//             throw Utils.createError(`Language: ${langId} is not supported`, 'language-not-supported')
//     }
//     if (!resault) throw Utils.createError(`Query: ${query} was not found in: ${dictionary}, Language: ${langId}`, 'query-not-found', 404)
//     return {
//         langId: langId,
//         entries: resault
//     }
// }

function getSingleItemById(dictionary, query, langId) {
    let resault = null
    let dict = getDictionary(dictionary)
    let dictObj = dict.find(item => item.id == query)
    if (dictObj) {
        switch (langId) {
            case '1':
                resault = {
                    key: dictObj.id,
                    value: dictObj.eng_name
                }
                break;
            case '2':
                resault = {
                    key: dictObj.id,
                    value: dictObj.heb_name
                }
                break;
            default:
                throw Utils.createError(`Language: ${langId} is not supported`, 'language-not-supported')
        }
    }
    if (!resault) throw Utils.createError(`Query: ${query} was not found in: ${dictionary}, Language: ${langId}`, 'query-not-found', 404)
    return {
        langId: langId,
        value: resault.value
    }
}

function getAllItems(dictionary, langId = null) {
    let dict = getDictionary(dictionary)
    let resault = []
    if (!langId)
        return dict
    else {
        langId = langId.toString()
        switch (langId) {
            case '1': //English
                for (var entry of dict) {
                    resault.push({
                        key: entry.id,
                        value: entry.eng_name
                    })
                }
                break;
            case '2': //Hebrew
                for (var entry of dict) {
                    resault.push({
                        key: entry.id,
                        value: entry.heb_name
                    })
                }
                break;
            default:
                throw Utils.createError(`Language: ${langId} is not supported`, 'language-not-supported')
        }
    }
    return {
        langId: langId,
        entries: resault
    }
}


function getDictionary(dictionary) {
    let dict = null
    switch (dictionary) {
        case 'address':
            dict = addresses
            break;
        case 'areaOfInterest':
            dict = areasOfInterest
            break;
        case 'city':
            dict = cities
            break;
        case 'county':
            dict = counties
            break;
        case 'country':
            dict = countries
            break;
        case 'department':
            dict = departments
            break;
        case 'expertise':
            dict = expertises
            break;
        case 'gender':
            dict = genders
            break;
        case 'language':
            dict = languages
            break;
        case 'rule':
            dict = rules
            break;
        case 'street':
            dict = streets
            break;
        case 'userTypes':
            dict = userTypes
            break;
        case 'workingPlace':
            dict = workingPlaces
            break;
        default:
            throw Utils.createError(`Dictionary: ${dictionary} is not supported`, 'dictionary-not-supported')
    }
    if (!dict) throw Utils.createError(`Dictionary: ${dictionary} was not found`, 'dictionary-not-found')
    return dict
}

function getReadableDemographic(demographic, langId = '1') {
    let resault = {}
    let country = null, county = null, city = null, street = null
    // let requestLanguage = null
    try {
        // requestLanguage = getItem('language', langId, langId)
        country = getItem('country', demographic.countryId, langId)
        if (country !== null)
            resault['countryId'] = {
                itemId: demographic.countryId,
                value: country.value
            }
        else {
            resault['countryId'] = null
        }
        county = getItem('county', demographic.countyId, langId)
        if (county !== null)
            resault['countyId'] = {
                itemId: demographic.countyId,
                value: county.value
            }
        else {
            resault['countyId'] = null
        }
        city = getItem('city', demographic.cityId, langId)
        if (city !== null)
            resault['cityId'] = {
                itemId: demographic.cityId,
                value: city.value
            }
        else {
            resault['cityId'] = null
        }
        street = getItem('street', demographic.streetId, langId)
        if (street !== null)
            resault['streetId'] = {
                itemId: demographic.streetId,
                value: street.value
            }
        else {
            resault['streetId'] = null
        }
    } catch (error) {
        throw error
    }
    return {
        langId: langId,
        value: resault
    }
}

function getReadableLanguage(langId) {
    let item = getItem('language', langId, langId)
    return {
        itemId: item.itemId,
        value: item.value
    }
}

module.exports = {
    getItem,
    getAllItems,
    getTranslatorSupportFields,
    getReadableDemographic,
    getReadableLanguage
}