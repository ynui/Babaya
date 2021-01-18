const Utils = require('../Utils')
const cities = require('../Demographics/Cities')
const genders = require('../Users/Genders')
const areasOfInterest = require('../AreasOfInterests/AreasOfInterest')
const expertises = require('../Expertises/Expertises')
const workingPlaces = require('../WorkingPlaces/WorkingPlaces')

function getDictionaries(){
    return [
        'city', 'gender', 'areaOfInterest', 'expertise', 'workingPlace'
    ]
}

function getItem(dictionary, query, lang = 'eng') {
    let resault = null
    let dict = getDictionary(dictionary)
    switch (lang) {
        case 'eng':
            let queryUpperCase = query.toUpperCase()
            resault = dict.find(item => item.eng_name === queryUpperCase)
            break;
        case 'heb':
            resault = dict.find(item => item.heb_name === query)
            break;
        case 'id':
            resault = dict.find(item => item.id == query)
            break;
        default:
            throw Utils.createError(`Language: ${lang} is not supported`, 'language-not-supported')
    }
    if (!resault) throw Utils.createError(`Query: ${query} was not found in: ${dictionary}, Language: ${lang}`, 'query-not-found', 404)
    return resault
}

function getAllItems(dictionary){
    return getDictionary(dictionary)
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
    getDictionaries
}