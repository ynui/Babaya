class Expertise {
    constructor(data) {
        this.expertiseID = data.expertiseID
        this.expertiseNameEng = data.expertiseNameEng
        this.expertiseNameHeb = data.expertiseNameHeb || null
        this.expertiseNameArb = data.expertiseNameArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }
}

class SubExpertise {
    constructor(data) {
        this.subExpertiseID = data.subExpertiseID
        this.subExpertiseEng = data.subExpertiseEng
        this.subExpertiseHeb = data.subExpertiseHeb || null
        this.subExpertiseArb = data.subExpertiseArb || null
    }
    get data() {
        return JSON.parse(JSON.stringify(this))
    }
}

const PRESETS = [
    {
        "id": 1,
        "eng_name": "ELECTRICITY",
        "heb_name": "חשמל"
    },
    {
        "id": 2,
        "eng_name": "WOODWORK",
        "heb_name": "נגרות"
    },
    {
        "id": 3,
        "eng_name": "KARATE",
        "heb_name": "קראטה"
    }
]

module.exports = {
    Expertise,
    SubExpertise,
    PRESETS
}