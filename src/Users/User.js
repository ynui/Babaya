const Utils = require('../Utils')

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
        this.demographic = data.demographic || null
        this.dateOfBirth = data.dateOfBirth || null
        this.demogrephicsOther = data.demogrephicsOther || []
        this.workingPlace = data.workingPlace || [] // list of [workingPlace, workingPlaceDepartment]. can be only workingPlace without workingPlaceDepartment 
        this.areaOfInterest = data.areaOfInterest || []  // list of [areaOfInterestID, subAreaOfInterest]. can be only areaOfInterest without subAreaOfInterest 
        this.expertise = data.expertise || []  // list of [expertise, subExpertise]. can be only expertise without subExpertise 
        this.groups = data.groups || []
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
                'demogrephicsOther', 'workingPlace', 'areaOfInterest', 'expertise',
                'groups'
            ]
        },
        update: {
            required: [
                'userId'
            ],
            optional: [
                'phoneNumber', 'languageID', 'userType', 'firstNameEng',
                'lastNameEng', 'firstNameHeb', 'lastNameHeb', 'firstNameArb',
                'lastNameArb', 'genderId', 'maritalStatus', 'demographic',
                'dateOfBirth', 'demogrephicsOther', 'workingPlace', 'areaOfInterest',
                'expertise', 'groups'
            ]
        },
        login: {
            required: ['email', 'password'],
            optional: []
        },
        addGroup: {
            required: ['userId', 'groupId'],
            optional: []
        },
        resetPassword: {
            required: ['email'],
            optional: []
        },
        removeGroup: {
            required: [
                'groupId', 'userId'
            ],
            optional: []
        },
        getUser: {
            required: [
            ],
            optional: ['langId']
        }
    }

    get data() {
        return JSON.parse(JSON.stringify(this))
    }

    addToGroupsList(groupId) {
        if (this.groups.includes(groupId)) throw Utils.createError(`${this.userId} is already in group ${groupId}`, 'user-already-in-group')
        else {
            this.groups.push(groupId)
        }
    }

    removeFromGroupsList(groupId) {
        if (!this.groups.includes(groupId)) throw Utils.createError(`${this.userId} is not member in ${groupId}`, 'user-not-contains-group')
        else {
            var groupIndx = this.groups.indexOf(groupId);
            if (groupIndx > -1) {
                this.groups.splice(groupIndx, 1);
            }
        }
    }
}

module.exports = User