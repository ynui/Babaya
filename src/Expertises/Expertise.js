class Expertise {
    constructor(data) {
        this.expertiseID = data.expertiseID
        this.expertiseNameEng = data.expertiseNameEng
        this.expertiseNameHeb = data.expertiseNameHeb || null
        this.expertiseNameArb = data.expertiseNameArb || null
    }
    get data() {
        return {
            expertiseID: this.expertiseID,
            expertiseNameEng: this.expertiseNameEng,
            expertiseNameHeb: this.expertiseNameHeb,
            expertiseNameArb: this.expertiseNameArb
        }
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
        return {
            subExpertiseID: this.subExpertiseID,
            subExpertiseEng: this.subExpertiseEng,
            subExpertiseHeb: this.subExpertiseHeb,
            subExpertiseArb: this.subExpertiseArb
        }
    }
}


module.exports = {
    Expertise,
    SubExpertise
}