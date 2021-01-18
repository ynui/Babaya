const DB_Utils = require('../DB/utils')

class AreaOfInterest {
    constructor(data) {
        this.areaOfInterestID = data.areaOfInterestID
        this.areaOfInterestNameEng = data.areaOfInterestNameEng
        this.areaOfInterestNameHeb = data.areaOfInterestNameHeb || null
        this.areaOfInterestNameArb = data.areaOfInterestNameArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }
}

class SubAreaOfInterest {
    constructor(data) {
        this.SubAreaOfInterestID = data.SubAreaOfInterestID
        this.SubAreaOfInterestEng = data.SubAreaOfInterestEng
        this.SubAreaOfInterestHeb = data.SubAreaOfInterestHeb || null
        this.SubAreaOfInterestArb = data.SubAreaOfInterestArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }

}

const PRESETS = [
    {
        "id": 1,
        "eng_name": "BASKETBALL",
        "heb_name": "כדורסל"
    },
    {
        "id": 2,
        "eng_name": "BOOKS",
        "heb_name": "ספרים"
    },
    {
        "id": 3,
        "eng_name": "BIRDS",
        "heb_name": "ציפורים"
    }
]

module.exports = {
    AreaOfInterest,
    SubAreaOfInterest,
    PRESETS
} 