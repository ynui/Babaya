const Utils = require('../Utils')

class Demographic {
    constructor(data) {
        this.countryId = data.countryId
        this.countyId = data.countyId || null
        this.cityId = data.cityId || null
        this.streetId = data.streetId || null
        this.demographicId = data.demographicId || Utils.generateHashId(JSON.stringify(this))
        this.users = data.users || []
        this.numberOfUsers = data.numberOfUsers || 0
        this.createTime = data.createTime || new Date().toISOString()
    }


    static RequestValidators = {
        create: {
            required: [
                'countryId'
            ],
            optional: [
                'countyId', 'cityId', 'streetId'
            ]
        },
        update: {
            required: [
                // 'demographocId'
            ],
            optional: [
                'countryId', 'countyId', 'cityId', 'streetId'
            ]
        },
        remove: {
            required: [
                'demographicId'
            ],
            optional: [
                // 'countryId', 'countyId', 'cityId', 'streetId'
            ]
        }
    }

    get data() {
        return JSON.parse(JSON.stringify(this))
    }

    static isDemographic(data, isArray = false) {
        let valid = false;
        if (isArray) {
            if (!Array.isArray(data))
                throw createError(`Input must be an array`, 'input-not-valid')
            if (data.length === 0) {
                valid = true
            } else {
                for (var demog of data) {
                    valid = isDemographic(demog)
                    if (!valid) {
                        break;
                    }
                }
            }
        } else {
            if (Array.isArray(data))
                throw createError(`Array is not a valid input`, 'input-not-valid')
            valid = Utils.validateCall(data, this.RequestValidators.create.required, this.RequestValidators.create.optional)
        }
        return valid
    }

    addToUsersList(userId) {
        this.numberOfUsers++;
        if (this.users.includes(userId))
            // throw Utils.createError(`${this.demographicId} already contains user ${userId}`, 'demographic-already-contains-user')
            console.warn(`${this.demographicId} already contains user ${userId}`, 'demographic-already-contains-user')
        else {
            this.users.push(userId)
        }
    }

    removeFromUsersList(userId) {
        this.numberOfUsers--;
        if (!this.users.includes(userId)) throw Utils.createError(`${userId} is not member in ${this.demographicId}`, 'demographic-not-contains-user')
        else {
            var userIndx = this.users.indexOf(userId);
            if (userIndx > -1) {
                this.users.splice(userIndx, 1);
            }
        }
    }
}

module.exports = Demographic