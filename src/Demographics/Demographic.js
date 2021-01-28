const Utils = require('../Utils')

class Demographic {
    constructor(data) {
        this.numberOfUsers = data.numberOfUsers || 0
        this.demographicId = data.demographicId || Utils.generateId()
        this.createTime = data.createTime || new Date().toISOString()
        this.countryId = data.countryId
        this.countyId = data.countyId || null
        this.cityId = data.cityId || null
        this.streetId = data.streetId || null
        this.users = data.users || []
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
        }
    }


    get data() {
        return JSON.parse(JSON.stringify(this))
    }


    addToUsersList(userId) {
        this.numberOfUsers++;
        if (this.users.includes(userId)) throw Utils.createError(`${this.demographicId} already contains user ${userId}`, 'group-already-contains-user')
        else {
            this.users.push(userId)
        }
    }

    removeFromUsersList(userId) {
        this.numberOfUsers--;
        if (!this.users.includes(userId)) throw Utils.createError(`${userId} is not member in ${this.demographicId}`, 'group-not-contains-user')
        else {
            var userIndx = this.users.indexOf(userId);
            if (userIndx > -1) {
                this.users.splice(userIndx, 1);
            }
        }
    }
}

module.exports = Demographic