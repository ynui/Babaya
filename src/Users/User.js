const Utils = require('../Utils')
const Demographic = require('../Demographics/Demographic')

class User {
    constructor(data) {
        this.userId = data.userId
        this.phoneNumber = data.phoneNumber
        this.email = data.email
        this.languageID = data.languageID
        this.userType = data.userType
        this.firstNameEng = data.firstNameEng
        this.lastNameEng = data.lastNameEng
        this.firstNameHeb = data.firstNameHeb || null
        this.lastNameHeb = data.lastNameHeb || null
        this.firstNameArb = data.firstNameArb || null
        this.lastNameArb = data.lastNameArb || null
        this.genderId = data.genderId || null
        this.maritalStatus = data.maritalStatus || null
        this.dateOfBirth = data.dateOfBirth || null
        this.demographicsOther = data.demographicsOther || []
        this.workingPlace = data.workingPlace || [] // list of [workingPlace, workingPlaceDepartment]. can be only workingPlace without workingPlaceDepartment 
        this.areaOfInterest = data.areaOfInterest || []  // list of [areaOfInterestID, subAreaOfInterest]. can be only areaOfInterest without subAreaOfInterest 
        this.expertise = data.expertise || []  // list of [expertise, subExpertise]. can be only expertise without subExpertise 
        this.groups = data.groups || []
        this.demographic = data.demographic || null



    }

    static RequestValidators = {
        register: {
            required: [
                'phoneNumber', 'email', 'password', 'languageID',
                'userType', 'firstNameEng', 'lastNameEng'
            ],
            optional: [
                'firstNameHeb', 'lastNameHeb', 'firstNameArb', 'lastNameArb',
                'genderId', 'maritalStatus', 'demographic', 'dateOfBirth',
                'demographicsOther', 'workingPlace', 'areaOfInterest', 'expertise',
                'groups'
            ]
        },
        update: {
            required: [
                // 'userId'
            ],
            optional: [
                'phoneNumber', 'languageID', 'userType', 'firstNameEng',
                'lastNameEng', 'firstNameHeb', 'lastNameHeb', 'firstNameArb',
                'lastNameArb', 'genderId', 'maritalStatus', 'demographic',
                'dateOfBirth', 'demographicsOther', 'workingPlace', 'areaOfInterest',
                'expertise', 'groups'
            ]
        },
        login: {
            required: ['email', 'password'],
            optional: []
        },
        addGroup: {
            required: ['groupId'],
            optional: []
        },
        resetPassword: {
            required: ['email'],
            optional: []
        },
        removeGroup: {
            required: [
                ['groupId']
            ],
            optional: []
        },
        getUser: {
            required: [],
            optional: ['langId']
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

    addToGroupsList(groupId) {
        if (this.groups.includes(groupId)) throw Utils.createError(`${this.userId} is already in group ${groupId}`, 'group-already-exists')
        else {
            this.groups.push(groupId)
        }
    }

    removeFromGroupsList(groupId) {
        if (!this.groups.includes(groupId)) throw Utils.createError(`${this.userId} is not member in ${groupId}`, 'group-not-exists')
        else {
            var groupIndx = this.groups.indexOf(groupId);
            if (groupIndx > -1) {
                this.groups.splice(groupIndx, 1);
            }
        }
    }

    addToFriendsList(userId) {
        if (this.friends.includes(userId)) throw Utils.createError(`${this.userId} is already friend of ${userId}`, 'friend-already-exists')
        else {
            this.groups.push(groupId)
        }
    }

    removeFromFriendsList(userId) {
        if (!this.friends.includes(userId)) throw Utils.createError(`${this.userId} is not friend of ${userId}`, 'friend-not-exists')
        else {
            var userIndx = this.friends.indexOf(userId);
            if (groupIndx > -1) {
                this.friends.splice(userIndx, 1);
            }
        }
    }

    setDemographic(data) {
        this.demographic = data
    }

    removeDemographic() {
        this.demographic = null
    }

    addToDemographicOthers(demographicId) {
        if (this.demographicsOther.includes(demographicId)) throw Utils.createError(`${this.userId} is already has demographic ${demographicId}`, 'demographic-already-exists')
        else {
            this.demographicsOther.push(demographicId)
        }
    }

    removeFromDemographicOthers(demographicId) {
        if (!this.demographicsOther.includes(demographicId)) throw Utils.createError(`${this.userId} does not has demographic ${demographicId}`, 'demographic-not-exists')
        else {
            var demoIndx = this.demographicsOther.indexOf(demographicId);
            if (demoIndx > -1) {
                this.demographicsOther.splice(demoIndx, 1);
            }
        }
    }
}

module.exports = User