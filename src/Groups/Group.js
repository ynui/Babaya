const Utils = require('../Utils')

class Group {
    static CREATE_REQIRED = [
        'name', 'description', 'createUser', 'publicity'
    ]
    static CREATE_OPTIONAL = [
        'groupManager', 'rulesList', 'rulesText', 'workingPlace',
        'areaOfInterest', 'expertise', 'demographicInfo', 'users', 'events',
        'discussion'
    ]
    constructor(data) {
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
        this.users = data.users || []
        this.events = data.events || []
        this.discussion = data.discussion || [] // text/ link/ image / vidio 
    }
    get data() {
        return {
            groupId: this.groupId,
            name: this.name,
            description: this.description,
            createTime: this.createTime,
            createUser: this.createUser,
            rulesList: this.rulesList,
            rulesText: this.rulesText,
            publicity: this.publicity,
            workingPlace: this.workingPlace,
            areaOfInterest: this.areaOfInterest,
            expertise: this.expertise,
            demographicInfo: this.demographicInfo,
            groupManager: this.groupManager,
            users: this.users,
            events: this.events,
            discussion: this.discussion
        }
    }

    addToUsersList(userId) {
        if (this.users.includes(userId)) throw `${this.groupId} already contains user ${userId}`
        this.users.push(userId)
    }
}


module.exports = Group