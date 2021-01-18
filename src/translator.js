const Utils = require('../src/Utils')
const translator = require('../src/DB/Translator')
const cities = translator.cities

function findCityByName(query, lang = 'eng') {
    let resault = null;
    switch (lang) {
        case 'eng':
            let queryUpperCase = query.toUpperCase()
            resault = cities.find(item => item.eng_name === queryUpperCase)
            break;
        case 'heb':
            resault = cities.find(item => item.heb_name === query)
            break;
        default:
            throw Utils.createError(`Language: ${lang} is not supportef`, 'language-not-supported', 404)
    }
    if (!resault) throw Utils.createError(`Query: ${query} Not Found. Language: ${lang}`, 'city-not-found', 404)
    return resault
}

module.exports = {
    cities,
    findCityByName
}