const Utils = require('../Utils')

class Group {
    constructor(data) {
        this.numberOfUsers = data.numberOfUsers || 0
        this.groupId = data.groupId || Utils.generateId()
        this.name = data.name
        this.description = data.description
        this.createTime = new Date().toISOString()
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
        }
    }

    get data() {
        return JSON.parse(JSON.stringify(this))
    }

    addToUsersList(userId) {
        this.numberOfUsers++;
        if (this.users.includes(userId))
        //  throw Utils.createError(`${this.groupId} already contains user ${userId}`, 'group-already-contains-user')
        console.warn(`${this.groupId} already contains user ${userId}`, 'group-already-contains-user')
        else {
            this.users.push(userId)
        }
    }
    
    removeFromUsersList(userId) {
        this.numberOfUsers--;
        if (!this.users.includes(userId)) throw Utils.createError(`${userId} is not member in ${this.groupId}`, 'group-not-contains-user')
        else {
            var userIndx = this.users.indexOf(userId);
            if (userIndx > -1) {
                this.users.splice(userIndx, 1);
            }
        }
    }
}


module.exports = Group