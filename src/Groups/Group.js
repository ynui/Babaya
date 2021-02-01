const Utils = require('../Utils')
const Demographic = require('../Demographics/Demographic')

class Group {
    constructor(data) {
        this.numberOfUsers = data.numberOfUsers || 1
        this.name = data.name
        this.description = data.description
        this.createTime = data.createTime || new Date().toISOString()
        this.createUser = data.createUser
        this.publicity = data.publicity
        this.groupManager = data.groupManager || [data.createUser] //list of user, role (admin, advisor)
        this.rulesList = data.rulesList || []
        this.rulesText = data.rulesText || []
        this.workingPlace = data.workingPlace || [] // list of [workingPlace, workingPlaceDepartment]. can be only workingPlace without workingPlaceDepartment 
        this.areaOfInterest = data.areaOfInterest || []  // list of [areaOfInterestID, subAreaOfInterest]. can be only areaOfInterest without subAreaOfInterest 
        this.expertise = data.expertise || []  // list of [expertise, subExpertise]. can be only expertise without subExpertise 
        this.demographicInfo = data.demographicInfo || [] // can be  country, county, city, street, can be part of it.... 
        this.users = data.users || [data.createUser]
        this.events = data.events || []
        this.discussion = data.discussion || [] // text/ link/ image / vidio 
        this.groupId = data.groupId || Utils.generateHashId(JSON.stringify(this))
    }

    static RequestValidators = {
        create: {
            required: [
                'name', 'description', 'createUser', 'publicity'
            ],
            optional: [
                'groupManager', 'rulesList', 'rulesText', 'workingPlace',
                'areaOfInterest', 'expertise', 'demographicInfo', 'users',
                'events', 'discussion'
            ]
        },
        update: {
            required: [
                'groupId'
            ],
            optional: [
                'name', 'description', 'pu,blicity', 'groupManager',
                'rulesList', 'rulesText', 'workingPlace', 'areaOfInterest',
                'expertise', 'demographicInfo', 'events', 'discussion'
            ]
        },
        removeUser: {
            required: [
                'groupId', 'userId'
            ],
            optional: []
        },
        addDemographic: {
            required: Demographic.RequestValidators.create.required,
            optional: Demographic.RequestValidators.create.optional
        },
        updateDemographic: {
            required: Demographic.RequestValidators.update.required,
            optional: Demographic.RequestValidators.update.optional
        }
    }

    get data() {
        return JSON.parse(JSON.stringify(this))
    }

    static isDataValid(data) {
        let validatingField = null
        let valid = true;
        try {
            for (var field in data) {
                validatingField = field
                let value = data[field]
                switch (field) {
                    case 'name':
                    case 'description':
                        valid = Utils.dataValidator(value, 'string')
                        break;
                    case 'numberOfUsers':
                        valid = Utils.dataValidator(value, 'number')
                        break;
                    case 'createTime':
                        valid = Utils.dataValidator(value, 'date')
                        break;
                    case 'publicity':
                    case 'rulesList':
                        valid = Utils.dataValidator(value, 'id')
                        break;
                    case 'rulesText':
                    case 'users':
                        valid = Utils.dataValidator(value, 'string')
                        break;
                    case 'workingPlace':
                    case 'areaOfInterest':
                    case 'expertise':
                        valid = Utils.dataValidator(value, 'id', true);
                        break;
                    case 'demographicInfo':
                        valid = Demographic.isDemographic(data)
                        break;
                    case 'groups':
                        valid = Utils.dataValidator(value, 'groups')
                        break;
                    default:
                        //TODO
                        break;
                }
                if (!valid) break;
            }
        } catch (error) {
            throw Utils.createError(`Error on ${validatingField}, ${error.message}`, error.code)
        }
        return valid
    }

    addToUsersList(userId) {
        this.numberOfUsers++;
        if (this.users.includes(userId))
            console.warn(`${this.groupId} already contains user ${userId}`, 'group-already-contains-user')
        else {
            this.users.push(userId)
        }
    }

    removeFromUsersList(userId) {
        this.numberOfUsers--;
        if (!this.users.includes(userId))
            console.warn(`${userId} is not member in ${this.groupId}`, 'group-not-contains-user')
        else {
            var userIndx = this.users.indexOf(userId);
            if (userIndx > -1) {
                this.users.splice(userIndx, 1);
            }
        }
    }
}


module.exports = Group