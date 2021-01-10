const DB_Utils = require('../DB/utils')

const CollectionUsersDetails = 'usersDetails'


class User {
    constructor(data) {
        this.uid = data.uid
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.genderID = data.genderID
        this.languageID = data.languageID
        this.phoneNumber = data.phoneNumber
        this.email = data.email
        this.cityID = data.cityID
        this.dateOfBirth = data.dateOfBirth
        this.groups = data.groups || []
    }

    get data() {
        const data = {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            genderID: this.genderID,
            languageID: this.languageID,
            phoneNumber: this.phoneNumber,
            email: this.email,
            cityID: this.cityID,
            dateOfBirth: this.dateOfBirth,
            groups: this.groups
        }
        return data
    }
}

module.exports = User