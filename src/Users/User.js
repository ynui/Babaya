class User {
    static REGISTER_FIELDS = ['phoneNumber', 'email', 'languageID', 'userType', 'firstNameEng', 'lastNameEng']
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
        this.streetID = data.streetID || null
        this.streetNum = data.streetNum || null
        this.dateOfBirth = data.dateOfBirth || null
        this.demographic = data.demographic || null
        this.demogrephicsOther = data.demogrephicsOther || []
        this.workingPlace = data.workingPlace || [] // list of [workingPlace, workingPlaceDepartment]. can be only workingPlace without workingPlaceDepartment 
        this.areaOfInterest = data.areaOfInterest || []  // list of [areaOfInterestID, subAreaOfInterest]. can be only areaOfInterest without subAreaOfInterest 
        this.expertise = data.expertise || []  // list of [expertise, subExpertise]. can be only expertise without subExpertise 
        this.groups = data.groups || []
    }
    get data() {
        return {
            uid: this.uid,
            phoneNumber: this.phoneNumber,
            email: this.email,
            languageID: this.languageID,
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
            streetID: this.streetID,
            streetNum: this.streetNum,
            dateOfBirth: this.dateOfBirth,
            workingPlace: this.workingPlace,
            areaOfInterest: this.areaOfInterest,
            expertise: this.expertise,
            groups: this.groups
        }
    }

    addToGroupsList(groupId) {
        if (this.groups.includes(groupId)) throw `${userId} is already in group ${groupId}`
        this.groups.push(groupId)
    }
}

module.exports = User