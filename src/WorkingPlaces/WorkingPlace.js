class WorkingPlace {
    constructor(data) {
        this.workingPlaceID = data.workingPlaceID
        this.workingPlaceNameEng = data.workingPlaceNameEng
        this.workingPlaceNameHeb = data.workingPlaceNameHeb || null
        this.workingPlaceNameArb = data.workingPlaceNameArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }
}

class workingPlaceDepartment {
    constructor(data) {
        this.workingPlaceDepartmentID = data.workingPlaceDepartmentID
        this.workingPlacDepartmenetNameEng = data.workingPlacDepartmenetNameEng
        this.workingPlacDepartmenetNameHeb = data.workingPlacDepartmenetNameHeb || null
        this.workingPlacDepartmenetNameArb = data.workingPlacDepartmenetNameArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }
}

const PRESETS = [
    {
        "id": 1,
        "eng_name": "BABAYA",
        "heb_name": "באבאיה"
    },
    {
        "id": 2,
        "eng_name": "MICROSOFT",
        "heb_name": "מייקרוסופט"
    },
    {
        "id": 3,
        "eng_name": "APPLE",
        "heb_name": "אפל"
    }
]

module.exports = {
    WorkingPlace,
    workingPlaceDepartment,
    PRESETS
}