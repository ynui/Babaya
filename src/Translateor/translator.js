const Utils = require('../Utils')
const cities = require('../Demographics/Cities')
const genders = require('../Users/Genders')
const areasOfInterest = require('../AreasOfInterests/AreasOfInterest')
const expertises = require('../Expertises/Expertises')
const workingPlaces = require('../WorkingPlaces/WorkingPlaces')


function getTranslatorSupportFields() {
    let dictionaries = getSupportedDictionaries();
    let languages = getSupportedLanguages();
    return {
        dictionaries: dictionaries,
        languages: languages
    }
}


function getSupportedLanguages() {
    return [
        'eng', 'heb'
    ]
}

function getSupportedDictionaries() {
    return [
        'city', 'gender', 'areaOfInterest', 'expertise', 'workingPlace'
    ]
}

function getItem(dictionary, query, langId = 'eng') {
    let resault = null
    query = query.toString()
    if (query.match(/^-?\d+$/))
        resault = getItemById(dictionary, query, langId)
    else
        resault = getItemByName(dictionary, query, langId)
    return resault
}

function getItemByName(dictionary, query, langId) {
    let resault = null
    let dict = getDictionary(dictionary)
    switch (langId) {
        case 'eng':
            resault = dict.find(item => item.eng_name.match(new RegExp(query, 'gi')))
            break;
        case 'heb':
            resault = dict.find(item => item.heb_name === query)
            break;
        default:
            throw Utils.createError(`Language: ${langId} is not supported`, 'language-not-supported')
    }
    if (!resault) throw Utils.createError(`Query: ${query} was not found in: ${dictionary}, Language: ${langId}`, 'query-not-found', 404)
    return {
        langId: langId,
        entries: resault
    }
}

function getItemById(dictionary, query, langId) {
    let resault = null
    let dict = getDictionary(dictionary)
    let dictObj = dict.find(item => item.id == query)
    if (dictObj) {
        switch (langId) {
            case 'eng':
                resault = {
                    key: dictObj.id,
                    value: dictObj.eng_name
                }
                break;
            case 'heb':
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
        entries: resault
    }
}

function getAllItems(dictionary, langId = null) {
    let dict = getDictionary(dictionary)
    let resault = []
    if (!langId)
        return dict
    else {
        switch (langId) {
            case 'eng':
                for (var entry of dict) {
                    resault.push({
                        key: entry.id,
                        value: entry.eng_name
                    })
                }
                break;
            case 'heb':
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
        case 'city':
            dict = cities
            break;
        case 'gender':
            dict = genders
            break;
        case 'areaOfInterest':
            dict = areasOfInterest
            break;
        case 'expertise':
            dict = expertises
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

module.exports = {
    getItem,
    getAllItems,
    getTranslatorSupportFields
}