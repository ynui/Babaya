const Utils = require('../Utils')

class User {
    constructor(data) {
        this.uid = data.uid
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
        this.genderID = data.genderID || null
        this.maritalStatus = data.maritalStatus || null
        this.demographic = data.demographic || null
        this.dateOfBirth = data.dateOfBirth || null
        this.demogrephicsOther = data.demogrephicsOther || []
        this.workingPlace = data.workingPlace || [] // list of [workingPlace, workingPlaceDepartment]. can be only workingPlace without workingPlaceDepartment 
        this.areaOfInterest = data.areaOfInterest || []  // list of [areaOfInterestID, subAreaOfInterest]. can be only areaOfInterest without subAreaOfInterest 
        this.expertise = data.expertise || []  // list of [expertise, subExpertise]. can be only expertise without subExpertise 
        this.groups = data.groups || []
    }

    static Validators = {
        registerRequest: {
            required: [
                'phoneNumber', 'email', 'password', 'languageID',
                'userType', 'firstNameEng', 'lastNameEng'],
            optional: [
                'firstNameHeb', 'lastNameHeb', 'firstNameArb', 'lastNameArb',
                'genderID', 'maritalStatus', 'demographic', 'dateOfBirth',
                'demogrephicsOther', 'workingPlace', 'areaOfInterest', 'expertise',
                'groups'
            ]
        },
        updateProfileRequest: {
            required: [],
            optional: [
                'phoneNumber', 'languageID', 'userType', 'firstNameEng',
                'lastNameEng', 'firstNameHeb', 'lastNameHeb', 'firstNameArb',
                'lastNameArb', 'genderID', 'maritalStatus', 'demographic',
                'dateOfBirth', 'demogrephicsOther', 'workingPlace', 'areaOfInterest',
                'expertise', 'groups'
            ]
        },
        loginRequest: {
            required: ['email', 'password'],
            optional: []
        }
    }

    get data() {
        return {
            uid: this.uid,
            phoneNumber: this.phoneNumber,
            email: this.email,
            languageID: this.languageID,
            userType: this.userType,
            firstNameEng: this.firstNameEng,
            lastNameEng: this.lastNameEng,
            firstNameHeb: this.firstNameHeb,
            lastNameHeb: this.lastNameHeb,
            firstNameArb: this.firstNameArb,
            lastNameArb: this.lastNameArb,
            genderID: this.genderID,
            maritalStatus: this.maritalStatus,
            demographic: this.demographic,
            demogrephicsOther: this.demogrephicsOther,
            dateOfBirth: this.dateOfBirth,
            workingPlace: this.workingPlace,
            areaOfInterest: this.areaOfInterest,
            expertise: this.expertise,
            groups: this.groups
        }
    }

    addToGroupsList(groupId) {
        if (this.groups.includes(groupId)) throw Utils.createError(`${userId} is already in group ${groupId}`)
        this.groups.push(groupId)
    }
}

module.exports = User